import prisma from "../lib/prisma.js";

export async function crearSolicitud(req, res) {
    try {
        const clienteId = req.usuario.usuarioId;

        const {
            categoriaId,
            titulo,
            descripcion,
            zona,
        } = req.body ?? {};

        if (!categoriaId || !titulo || !descripcion) {
            return res.status(400).json({
                message: "Categoría, título y descripción son obligatorios",
            });
        }

        const categoriaIdNumero = Number(categoriaId);

        if (!Number.isInteger(categoriaIdNumero)) {
            return res.status(400).json({
                message: "El ID de la categoría no es válido",
            });
        }

        const categoria = await prisma.categoria.findUnique({
            where: {
                id: categoriaIdNumero,
            },
        });

        if (!categoria || !categoria.estaActiva) {
            return res.status(400).json({
                message: "La categoría indicada no existe o está inactiva",
            });
        }

        const solicitud = await prisma.solicitudServicio.create({
            data: {
                clienteId,
                categoriaId: categoriaIdNumero,
                titulo,
                descripcion,
                zona: zona ?? null,
            },
            select: {
                id: true,
                titulo: true,
                descripcion: true,
                zona: true,
                fechaCreacion: true,
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
        });

        res.status(201).json({
            message: "Solicitud publicada correctamente",
            solicitud,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al crear la solicitud",
        });
    }
}


export async function obtenerMisSolicitudes(req, res) {
    try {
        const clienteId = req.usuario.usuarioId;

        const solicitudes = await prisma.solicitudServicio.findMany({
            where: {
                clienteId,
            },
            select: {
                id: true,
                titulo: true,
                descripcion: true,
                zona: true,
                fechaCreacion: true,
                estado: true,
                categoria: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
            },
            orderBy: {
                fechaCreacion: "desc",
            },
        });

        res.json({
            solicitudes,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al obtener las solicitudes",
        });
    }
}


export async function obtenerSolicitudesCompatibles(req, res) {
    try {
        const usuarioId = req.usuario.usuarioId;

        // Buscar el perfil del trabajador y sus categorías
        const perfil = await prisma.perfilTrabajador.findUnique({
            where: {
                usuarioId,
            },
            select: {
                id: true,
                categorias: {
                    select: {
                        categoriaId: true,
                    },
                },
            },
        });

        if (!perfil) {
            return res.status(404).json({
                message: "No posee un perfil de trabajador",
            });
        }

        const categoriaIds = perfil.categorias.map(
            (item) => item.categoriaId
        );

        // Si todavía no tiene rubros asignados
        if (categoriaIds.length === 0) {
            return res.json({
                solicitudes: [],
            });
        }

        const solicitudes = await prisma.solicitudServicio.findMany({
            where: {
                estado: "PUBLICADA",

                categoriaId: {
                    in: categoriaIds,
                },

                // No mostrar solicitudes creadas por el mismo usuario
                clienteId: {
                    not: usuarioId,
                },
            },

            select: {
                id: true,
                titulo: true,
                descripcion: true,
                zona: true,
                fechaCreacion: true,
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
                        estaVerificado: true,
                    },
                },
            },

            orderBy: {
                fechaCreacion: "desc",
            },
        });

        res.json({
            solicitudes,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al obtener las solicitudes compatibles",
        });
    }
}


export async function crearPropuesta(req, res) {
    try {
        const usuarioId = req.usuario.usuarioId;
        const solicitudId = Number(req.params.id);

        const {
            monto,
            mensaje,
            diasEstimados,
        } = req.body ?? {};

        if (!Number.isInteger(solicitudId)) {
            return res.status(400).json({
                message: "El ID de la solicitud no es válido",
            });
        }

        if (
            monto === undefined ||
            monto === null ||
            Number.isNaN(Number(monto)) ||
            Number(monto) <= 0
        ) {
            return res.status(400).json({
                message: "Debe indicar un monto válido",
            });
        }

        if (
            diasEstimados !== undefined &&
            (!Number.isInteger(Number(diasEstimados)) ||
                Number(diasEstimados) <= 0)
        ) {
            return res.status(400).json({
                message: "Los días estimados no son válidos",
            });
        }

        // Buscar perfil del trabajador con sus categorías
        const perfil = await prisma.perfilTrabajador.findUnique({
            where: {
                usuarioId,
            },
            select: {
                id: true,

                usuario: {
                    select: {
                        nombre: true,
                        apellido: true,
                    },
                },

                categorias: {
                    select: {
                        categoriaId: true,
                    },
                },
            },
        });

        if (!perfil) {
            return res.status(404).json({
                message: "No posee un perfil de trabajador",
            });
        }

        // Buscar la solicitud
        const solicitud = await prisma.solicitudServicio.findUnique({
            where: {
                id: solicitudId,
            },
            select: {
                id: true,
                clienteId: true,
                categoriaId: true,
                estado: true,
                titulo: true,
            },
        });

        if (!solicitud) {
            return res.status(404).json({
                message: "Solicitud no encontrada",
            });
        }

        if (solicitud.estado !== "PUBLICADA") {
            return res.status(400).json({
                message: "La solicitud ya no se encuentra disponible",
            });
        }

        // Evitar postularse a una solicitud propia
        if (solicitud.clienteId === usuarioId) {
            return res.status(403).json({
                message: "No puede enviar una propuesta a su propia solicitud",
            });
        }

        // Verificar que la categoría coincida con un rubro del trabajador
        const tieneCategoria = perfil.categorias.some(
            (item) => item.categoriaId === solicitud.categoriaId
        );

        if (!tieneCategoria) {
            return res.status(403).json({
                message: "La solicitud no corresponde a uno de sus rubros",
            });
        }

        // Evitar una segunda propuesta del mismo trabajador
        const propuestaExistente = await prisma.propuestaServicio.findUnique({
            where: {
                solicitudId_perfilTrabajadorId: {
                    solicitudId,
                    perfilTrabajadorId: perfil.id,
                },
            },
        });

        if (propuestaExistente) {
            return res.status(409).json({
                message: "Ya envió una propuesta para esta solicitud",
            });
        }

        const propuesta = await prisma.propuestaServicio.create({
            data: {
                solicitudId,
                perfilTrabajadorId: perfil.id,
                monto: Number(monto),
                mensaje: mensaje ?? null,
                diasEstimados:
                    diasEstimados !== undefined
                        ? Number(diasEstimados)
                        : null,
            },
            select: {
                id: true,
                monto: true,
                mensaje: true,
                diasEstimados: true,
                fechaCreacion: true,
                estado: true,

                solicitud: {
                    select: {
                        id: true,
                        titulo: true,
                    },
                },

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
        });

        await prisma.notificacion.create({
            data: {
                usuarioId: solicitud.clienteId,
                tipo: "PROPUESTA_RECIBIDA",
                titulo: "Nueva propuesta recibida",
                mensaje: `${perfil.usuario.nombre} ${perfil.usuario.apellido} envió una propuesta para "${solicitud.titulo}"`,
                referenciaId: solicitud.id,
            },
        });

        res.status(201).json({
            message: "Propuesta enviada correctamente",
            propuesta,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al enviar la propuesta",
        });
    }
}


export async function obtenerPropuestasSolicitud(req, res) {
    try {
        const usuarioId = req.usuario.usuarioId;
        const solicitudId = Number(req.params.id);

        if (!Number.isInteger(solicitudId)) {
            return res.status(400).json({
                message: "El ID de la solicitud no es válido",
            });
        }

        const solicitud = await prisma.solicitudServicio.findUnique({
            where: {
                id: solicitudId,
            },
            select: {
                id: true,
                clienteId: true,
                titulo: true,
                estado: true,
            },
        });

        if (!solicitud) {
            return res.status(404).json({
                message: "Solicitud no encontrada",
            });
        }

        if (solicitud.clienteId !== usuarioId) {
            return res.status(403).json({
                message: "No tiene permisos para consultar las propuestas de esta solicitud",
            });
        }

        const propuestas = await prisma.propuestaServicio.findMany({
            where: {
                solicitudId,
            },
            select: {
                id: true,
                monto: true,
                mensaje: true,
                diasEstimados: true,
                fechaCreacion: true,
                estado: true,

                perfilTrabajador: {
                    select: {
                        id: true,
                        tituloProfesional: true,
                        descripcion: true,
                        zonaTrabajo: true,
                        aniosExperiencia: true,
                        calificacion: true,
                        trabajosRealizados: true,
                        disponible: true,

                        usuario: {
                            select: {
                                id: true,
                                nombre: true,
                                apellido: true,
                                estaVerificado: true,
                            },
                        },

                        categorias: {
                            select: {
                                categoria: {
                                    select: {
                                        id: true,
                                        nombre: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                fechaCreacion: "asc",
            },
        });

        const propuestasFormateadas = propuestas.map((propuesta) => ({
            ...propuesta,

            perfilTrabajador: {
                ...propuesta.perfilTrabajador,

                categorias: propuesta.perfilTrabajador.categorias.map(
                    (item) => item.categoria
                ),
            },
        }));

        res.json({
            solicitud: {
                id: solicitud.id,
                titulo: solicitud.titulo,
                estado: solicitud.estado,
            },

            propuestas: propuestasFormateadas,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al obtener las propuestas",
        });
    }
}


export async function aceptarPropuesta(req, res) {
    try {
        const usuarioId = req.usuario.usuarioId;
        const solicitudId = Number(req.params.solicitudId);
        const propuestaId = Number(req.params.propuestaId);

        if (
            !Number.isInteger(solicitudId) ||
            !Number.isInteger(propuestaId)
        ) {
            return res.status(400).json({
                message: "Los IDs indicados no son válidos",
            });
        }

        // Verificar que la solicitud exista y pertenezca al cliente
        const solicitud = await prisma.solicitudServicio.findUnique({
            where: {
                id: solicitudId,
            },
            select: {
                id: true,
                clienteId: true,
                titulo: true,
                estado: true,
            },
        });

        if (!solicitud) {
            return res.status(404).json({
                message: "Solicitud no encontrada",
            });
        }

        if (solicitud.clienteId !== usuarioId) {
            return res.status(403).json({
                message: "No tiene permisos para aceptar propuestas de esta solicitud",
            });
        }

        if (solicitud.estado !== "PUBLICADA") {
            return res.status(400).json({
                message: "La solicitud ya no se encuentra disponible para aceptar propuestas",
            });
        }

        // Verificar que la propuesta exista y pertenezca a esta solicitud
        const propuesta = await prisma.propuestaServicio.findUnique({
            where: {
                id: propuestaId,
            },
            select: {
                id: true,
                solicitudId: true,
                estado: true,
                perfilTrabajadorId: true,
            },
        });

        if (!propuesta) {
            return res.status(404).json({
                message: "Propuesta no encontrada",
            });
        }

        if (propuesta.solicitudId !== solicitudId) {
            return res.status(400).json({
                message: "La propuesta no corresponde a esta solicitud",
            });
        }

        if (propuesta.estado !== "PENDIENTE") {
            return res.status(400).json({
                message: "La propuesta ya no se encuentra pendiente",
            });
        }

        // Todo el cambio se realiza como una única operación lógica
        const resultado = await prisma.$transaction(async (tx) => {
            const propuestaAceptada = await tx.propuestaServicio.update({
                where: {
                    id: propuestaId,
                },
                data: {
                    estado: "ACEPTADA",
                },
                select: {
                    id: true,
                    monto: true,
                    mensaje: true,
                    diasEstimados: true,
                    estado: true,

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
            });

            const propuestasARechazar = await tx.propuestaServicio.findMany({
                where: {
                    solicitudId,
                    id: {
                        not: propuestaId,
                    },
                    estado: "PENDIENTE",
                },
                select: {
                    perfilTrabajador: {
                        select: {
                            usuario: {
                                select: {
                                    id: true,
                                },
                            },
                        },
                    },
                },
            });

            // Rechazar las demás propuestas pendientes
            await tx.propuestaServicio.updateMany({
                where: {
                    solicitudId,
                    id: {
                        not: propuestaId,
                    },
                    estado: "PENDIENTE",
                },
                data: {
                    estado: "RECHAZADA",
                },
            });

            const solicitudActualizada = await tx.solicitudServicio.update({
                where: {
                    id: solicitudId,
                },
                data: {
                    estado: "EN_PROCESO",
                },
                select: {
                    id: true,
                    titulo: true,
                    estado: true,
                },
            });

            if (propuestasARechazar.length > 0) {
                await tx.notificacion.createMany({
                    data: propuestasARechazar.map((item) => ({
                        usuarioId: item.perfilTrabajador.usuario.id,
                        tipo: "PROPUESTA_RECHAZADA",
                        titulo: "Propuesta no seleccionada",
                        mensaje: `Tu propuesta para "${solicitud.titulo}" no fue seleccionada`,
                        referenciaId: solicitud.id,
                    })),
                });
            }

            const contratacion = await tx.contratacion.create({
                data: {
                    solicitudId,
                    propuestaId,
                    montoAcordado: propuestaAceptada.monto,
                },
                select: {
                    id: true,
                    montoAcordado: true,
                    fechaContratacion: true,
                    estado: true,
                },
            });

            await tx.notificacion.create({
                data: {
                    usuarioId: propuestaAceptada.perfilTrabajador.usuario.id,
                    tipo: "PROPUESTA_ACEPTADA",
                    titulo: "Propuesta aceptada",
                    mensaje: `Tu propuesta para "${solicitud.titulo}" fue aceptada`,
                    referenciaId: solicitud.id,
                },
            });

            return {
                propuestaAceptada,
                solicitudActualizada,
                contratacion,
            };
        });

        res.json({
            message: "Propuesta aceptada correctamente",
            solicitud: resultado.solicitudActualizada,
            propuesta: resultado.propuestaAceptada,
            contratacion: resultado.contratacion,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al aceptar la propuesta",
        });
    }
}


export async function cancelarSolicitud(req, res) {
  try {
    const usuarioId = req.usuario.usuarioId;
    const solicitudId = Number(req.params.id);

    if (!Number.isInteger(solicitudId)) {
      return res.status(400).json({
        message: "El ID de la solicitud no es válido",
      });
    }

    const solicitud = await prisma.solicitudServicio.findUnique({
      where: {
        id: solicitudId,
      },
      select: {
        id: true,
        clienteId: true,
        titulo: true,
        estado: true,
      },
    });

    if (!solicitud) {
      return res.status(404).json({
        message: "Solicitud no encontrada",
      });
    }

    if (solicitud.clienteId !== usuarioId) {
      return res.status(403).json({
        message: "No tiene permisos para cancelar esta solicitud",
      });
    }

    if (solicitud.estado !== "PUBLICADA") {
      return res.status(400).json({
        message: "Solo se puede cancelar una solicitud publicada",
      });
    }

    const resultado = await prisma.$transaction(async (tx) => {
      const solicitudCancelada = await tx.solicitudServicio.update({
        where: {
          id: solicitudId,
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

      await tx.propuestaServicio.updateMany({
        where: {
          solicitudId,
          estado: "PENDIENTE",
        },
        data: {
          estado: "RECHAZADA",
        },
      });

      return solicitudCancelada;
    });

    res.json({
      message: "Solicitud cancelada correctamente",
      solicitud: resultado,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al cancelar la solicitud",
    });
  }
}


export async function retirarPropuesta(req, res) {
  try {
    const usuarioId = req.usuario.usuarioId;
    const solicitudId = Number(req.params.solicitudId);
    const propuestaId = Number(req.params.propuestaId);

    if (
      !Number.isInteger(solicitudId) ||
      !Number.isInteger(propuestaId)
    ) {
      return res.status(400).json({
        message: "Los IDs indicados no son válidos",
      });
    }

    const perfil = await prisma.perfilTrabajador.findUnique({
      where: {
        usuarioId,
      },
      select: {
        id: true,
      },
    });

    if (!perfil) {
      return res.status(404).json({
        message: "No posee un perfil de trabajador",
      });
    }

    const propuesta = await prisma.propuestaServicio.findUnique({
      where: {
        id: propuestaId,
      },
      select: {
        id: true,
        solicitudId: true,
        perfilTrabajadorId: true,
        estado: true,

        solicitud: {
          select: {
            estado: true,
          },
        },
      },
    });

    if (!propuesta) {
      return res.status(404).json({
        message: "Propuesta no encontrada",
      });
    }

    if (propuesta.solicitudId !== solicitudId) {
      return res.status(400).json({
        message: "La propuesta no corresponde a esta solicitud",
      });
    }

    if (propuesta.perfilTrabajadorId !== perfil.id) {
      return res.status(403).json({
        message: "No tiene permisos para retirar esta propuesta",
      });
    }

    if (propuesta.estado !== "PENDIENTE") {
      return res.status(400).json({
        message: "Solo se puede retirar una propuesta pendiente",
      });
    }

    if (propuesta.solicitud.estado !== "PUBLICADA") {
      return res.status(400).json({
        message: "La solicitud ya no se encuentra disponible",
      });
    }

    const propuestaRetirada =
      await prisma.propuestaServicio.update({
        where: {
          id: propuestaId,
        },
        data: {
          estado: "RETIRADA",
        },
        select: {
          id: true,
          monto: true,
          mensaje: true,
          diasEstimados: true,
          fechaCreacion: true,
          estado: true,
        },
      });

    res.json({
      message: "Propuesta retirada correctamente",
      propuesta: propuestaRetirada,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al retirar la propuesta",
    });
  }
}