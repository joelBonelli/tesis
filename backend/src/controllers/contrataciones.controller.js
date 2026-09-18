import prisma from "../lib/prisma.js";



export async function obtenerMisContrataciones(req, res) {
  try {
    const usuarioId = req.usuario.usuarioId;

    const contrataciones = await prisma.contratacion.findMany({
      where: {
        OR: [
          // El usuario es el cliente
          {
            solicitud: {
              clienteId: usuarioId,
            },
          },

          // El usuario es el trabajador contratado
          {
            propuesta: {
              perfilTrabajador: {
                usuarioId,
              },
            },
          },
        ],
      },

      select: {
        id: true,
        montoAcordado: true,
        fechaContratacion: true,
        fechaFinalizacion: true,
        estado: true,

        solicitud: {
          select: {
            id: true,
            titulo: true,
            descripcion: true,
            zona: true,
            estado: true,

            categoria: {
              select: {
                id: true,
                nombre: true,
              },
            },

            cliente: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
              },
            },
          },
        },

        propuesta: {
          select: {
            id: true,
            mensaje: true,
            diasEstimados: true,

            perfilTrabajador: {
              select: {
                id: true,
                tituloProfesional: true,

                usuario: {
                  select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                  },
                },
              },
            },
          },
        },
      },

      orderBy: {
        fechaContratacion: "desc",
      },
    });

    res.json({
      contrataciones,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener las contrataciones",
    });
  }
}


export async function finalizarContratacion(req, res) {
  try {
    const usuarioId = req.usuario.usuarioId;
    const contratacionId = Number(req.params.id);

    if (!Number.isInteger(contratacionId)) {
      return res.status(400).json({
        message: "El ID de la contratación no es válido",
      });
    }

    const contratacion = await prisma.contratacion.findUnique({
      where: {
        id: contratacionId,
      },
      select: {
        id: true,
        estado: true,
        solicitudId: true,

        solicitud: {
          select: {
            clienteId: true,
            estado: true,
          },
        },

        propuesta: {
          select: {
            perfilTrabajadorId: true,
          },
        },
      },
    });

    if (!contratacion) {
      return res.status(404).json({
        message: "Contratación no encontrada",
      });
    }

    // Solo el cliente dueño de la solicitud puede finalizarla
    if (contratacion.solicitud.clienteId !== usuarioId) {
      return res.status(403).json({
        message: "No tiene permisos para finalizar esta contratación",
      });
    }

    if (contratacion.estado !== "EN_PROCESO") {
      return res.status(400).json({
        message: "La contratación no se encuentra en proceso",
      });
    }

    const resultado = await prisma.$transaction(async (tx) => {
      const contratacionFinalizada = await tx.contratacion.update({
        where: {
          id: contratacionId,
        },
        data: {
          estado: "FINALIZADA",
          fechaFinalizacion: new Date(),
        },
        select: {
          id: true,
          montoAcordado: true,
          fechaContratacion: true,
          fechaFinalizacion: true,
          estado: true,
        },
      });

      const solicitudFinalizada = await tx.solicitudServicio.update({
        where: {
          id: contratacion.solicitudId,
        },
        data: {
          estado: "FINALIZADA",
        },
        select: {
          id: true,
          titulo: true,
          estado: true,
        },
      });

      await tx.perfilTrabajador.update({
        where: {
          id: contratacion.propuesta.perfilTrabajadorId,
        },
        data: {
          trabajosRealizados: {
            increment: 1,
          },
        },
      });

      return {
        contratacionFinalizada,
        solicitudFinalizada,
      };
    });

    res.json({
      message: "Contratación finalizada correctamente",
      contratacion: resultado.contratacionFinalizada,
      solicitud: resultado.solicitudFinalizada,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al finalizar la contratación",
    });
  }
}


export async function calificarContratacion(req, res) {
  try {
    const usuarioId = req.usuario.usuarioId;
    const contratacionId = Number(req.params.id);

    const {
      puntuacion,
      comentario,
    } = req.body ?? {};

    if (!Number.isInteger(contratacionId)) {
      return res.status(400).json({
        message: "El ID de la contratación no es válido",
      });
    }

    const puntuacionNumero = Number(puntuacion);

    if (
      !Number.isInteger(puntuacionNumero) ||
      puntuacionNumero < 1 ||
      puntuacionNumero > 5
    ) {
      return res.status(400).json({
        message: "La puntuación debe ser un número entero entre 1 y 5",
      });
    }

    const contratacion = await prisma.contratacion.findUnique({
      where: {
        id: contratacionId,
      },
      select: {
        id: true,
        estado: true,

        solicitud: {
          select: {
            clienteId: true,
          },
        },

        propuesta: {
          select: {
            perfilTrabajadorId: true,
          },
        },

        calificacion: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!contratacion) {
      return res.status(404).json({
        message: "Contratación no encontrada",
      });
    }

    if (contratacion.solicitud.clienteId !== usuarioId) {
      return res.status(403).json({
        message: "No tiene permisos para calificar esta contratación",
      });
    }

    if (contratacion.estado !== "FINALIZADA") {
      return res.status(400).json({
        message: "Solo puede calificar una contratación finalizada",
      });
    }

    if (contratacion.calificacion) {
      return res.status(409).json({
        message: "Esta contratación ya fue calificada",
      });
    }

    const resultado = await prisma.$transaction(async (tx) => {
      const calificacion = await tx.calificacionServicio.create({
        data: {
          contratacionId,
          perfilTrabajadorId:
            contratacion.propuesta.perfilTrabajadorId,
          puntuacion: puntuacionNumero,
          comentario: comentario ?? null,
        },
        select: {
          id: true,
          puntuacion: true,
          comentario: true,
          fechaCreacion: true,
        },
      });

      const promedio = await tx.calificacionServicio.aggregate({
        where: {
          perfilTrabajadorId:
            contratacion.propuesta.perfilTrabajadorId,
        },
        _avg: {
          puntuacion: true,
        },
      });

      const perfilActualizado = await tx.perfilTrabajador.update({
        where: {
          id: contratacion.propuesta.perfilTrabajadorId,
        },
        data: {
          calificacion: promedio._avg.puntuacion ?? 0,
        },
        select: {
          id: true,
          calificacion: true,
          trabajosRealizados: true,
        },
      });

      return {
        calificacion,
        perfilActualizado,
      };
    });

    res.status(201).json({
      message: "Calificación registrada correctamente",
      calificacion: resultado.calificacion,
      perfilTrabajador: resultado.perfilActualizado,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al registrar la calificación",
    });
  }
}


export async function cancelarContratacion(req, res) {
  try {
    const usuarioId = req.usuario.usuarioId;
    const contratacionId = Number(req.params.id);

    if (!Number.isInteger(contratacionId)) {
      return res.status(400).json({
        message: "El ID de la contratación no es válido",
      });
    }

    const contratacion = await prisma.contratacion.findUnique({
      where: {
        id: contratacionId,
      },
      select: {
        id: true,
        estado: true,
        solicitudId: true,

        solicitud: {
          select: {
            clienteId: true,
          },
        },

        propuesta: {
          select: {
            perfilTrabajador: {
              select: {
                usuarioId: true,
              },
            },
          },
        },
      },
    });

    if (!contratacion) {
      return res.status(404).json({
        message: "Contratación no encontrada",
      });
    }

    const esCliente =
      contratacion.solicitud.clienteId === usuarioId;

    const esTrabajador =
      contratacion.propuesta.perfilTrabajador.usuarioId === usuarioId;

    if (!esCliente && !esTrabajador) {
      return res.status(403).json({
        message: "No tiene permisos para cancelar esta contratación",
      });
    }

    if (contratacion.estado !== "EN_PROCESO") {
      return res.status(400).json({
        message: "Solo se puede cancelar una contratación en proceso",
      });
    }

    const resultado = await prisma.$transaction(async (tx) => {
      const contratacionCancelada = await tx.contratacion.update({
        where: {
          id: contratacionId,
        },
        data: {
          estado: "CANCELADA",
        },
        select: {
          id: true,
          montoAcordado: true,
          fechaContratacion: true,
          estado: true,
        },
      });

      const solicitudCancelada = await tx.solicitudServicio.update({
        where: {
          id: contratacion.solicitudId,
        },
        data: {
          estado: "CANCELADA",
        },
        select: {
          id: true,
          titulo: true,
          estado: true,
        },
      });

      return {
        contratacionCancelada,
        solicitudCancelada,
      };
    });

    res.json({
      message: "Contratación cancelada correctamente",
      contratacion: resultado.contratacionCancelada,
      solicitud: resultado.solicitudCancelada,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al cancelar la contratación",
    });
  }
}