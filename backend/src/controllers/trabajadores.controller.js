import prisma from "../lib/prisma.js";

export async function crearMiPerfilTrabajador(req, res) {
  try {
    const usuarioId = req.usuario.usuarioId;

    const {
      tituloProfesional,
      descripcion,
      zonaTrabajo,
      aniosExperiencia,
    } = req.body ?? {};

    if (
      aniosExperiencia !== undefined &&
      (!Number.isInteger(Number(aniosExperiencia)) ||
        Number(aniosExperiencia) < 0)
    ) {
      return res.status(400).json({
        message: "Los años de experiencia no son válidos",
      });
    }

    const perfilExistente = await prisma.perfilTrabajador.findUnique({
      where: {
        usuarioId,
      },
    });

    if (perfilExistente) {
      return res.status(409).json({
        message: "El usuario ya posee un perfil de trabajador",
      });
    }

    const perfil = await prisma.perfilTrabajador.create({
      data: {
        usuarioId,
        tituloProfesional,
        descripcion,
        zonaTrabajo,
        aniosExperiencia:
          aniosExperiencia !== undefined
            ? Number(aniosExperiencia)
            : null,
      },
      select: {
        id: true,
        usuarioId: true,
        tituloProfesional: true,
        descripcion: true,
        zonaTrabajo: true,
        aniosExperiencia: true,
        calificacion: true,
        trabajosRealizados: true,
        disponible: true,
        fechaCreacion: true,
      },
    });

    res.status(201).json({
      message: "Perfil de trabajador creado correctamente",
      perfil,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al crear el perfil de trabajador",
    });
  }
}

export async function obtenerMiPerfilTrabajador(req, res) {
  try {
    const usuarioId = req.usuario.usuarioId;

    const perfil = await prisma.perfilTrabajador.findUnique({
      where: {
        usuarioId,
      },
      select: {
        id: true,
        tituloProfesional: true,
        descripcion: true,
        zonaTrabajo: true,
        aniosExperiencia: true,
        calificacion: true,
        trabajosRealizados: true,
        disponible: true,
        fechaCreacion: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          },
        },
      },
    });

    if (!perfil) {
      return res.status(404).json({
        message: "No posee un perfil de trabajador",
      });
    }

    res.json(perfil);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener el perfil de trabajador",
    });
  }
}


export async function actualizarMiPerfilTrabajador(req, res) {
  try {
    const usuarioId = req.usuario.usuarioId;

    const {
      tituloProfesional,
      descripcion,
      zonaTrabajo,
      aniosExperiencia,
      disponible,
    } = req.body ?? {};

    const perfilExistente = await prisma.perfilTrabajador.findUnique({
      where: {
        usuarioId,
      },
    });

    if (!perfilExistente) {
      return res.status(404).json({
        message: "No posee un perfil de trabajador",
      });
    }

    if (
      aniosExperiencia !== undefined &&
      (!Number.isInteger(Number(aniosExperiencia)) ||
        Number(aniosExperiencia) < 0)
    ) {
      return res.status(400).json({
        message: "Los años de experiencia no son válidos",
      });
    }

    const perfilActualizado = await prisma.perfilTrabajador.update({
      where: {
        usuarioId,
      },
      data: {
        tituloProfesional,
        descripcion,
        zonaTrabajo,
        aniosExperiencia:
          aniosExperiencia !== undefined
            ? Number(aniosExperiencia)
            : undefined,
        disponible,
      },
      select: {
        id: true,
        tituloProfesional: true,
        descripcion: true,
        zonaTrabajo: true,
        aniosExperiencia: true,
        calificacion: true,
        trabajosRealizados: true,
        disponible: true,
        fechaCreacion: true,
      },
    });

    res.json({
      message: "Perfil actualizado correctamente",
      perfil: perfilActualizado,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar el perfil de trabajador",
    });
  }
}



export function pruebaTrabajador(req, res) {
  res.json({
    message: "Acceso autorizado para trabajador",
    usuario: {
      usuarioId: req.usuario.usuarioId,
      email: req.usuario.email,
      roles: req.usuario.roles,
    },
  });
}



export async function obtenerTrabajadorPorId(req, res) {
  try {
    const usuarioId = Number(req.params.id);

    if (Number.isNaN(usuarioId)) {
      return res.status(400).json({
        message: "El ID del trabajador no es válido",
      });
    }

    const perfil = await prisma.perfilTrabajador.findUnique({
      where: {
        usuarioId,
      },
      select: {
        id: true,
        tituloProfesional: true,
        descripcion: true,
        zonaTrabajo: true,
        aniosExperiencia: true,
        calificacion: true,
        trabajosRealizados: true,
        disponible: true,
        fechaCreacion: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            estaVerificado: true,
          },
        },
      },
    });

    if (!perfil) {
      return res.status(404).json({
        message: "Trabajador no encontrado",
      });
    }

    res.json(perfil);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener el trabajador",
    });
  }
}

export async function asignarCategoriasMiPerfil(req, res) {
  try {
    const usuarioId = req.usuario.usuarioId;
    const { categoriaIds } = req.body ?? {};

    if (!Array.isArray(categoriaIds) || categoriaIds.length === 0) {
      return res.status(400).json({
        message: "Debe indicar al menos una categoría",
      });
    }

    const perfil = await prisma.perfilTrabajador.findUnique({
      where: {
        usuarioId,
      },
    });

    if (!perfil) {
      return res.status(404).json({
        message: "No posee un perfil de trabajador",
      });
    }

    const idsNormalizados = [
      ...new Set(categoriaIds.map((id) => Number(id))),
    ];

    if (idsNormalizados.some((id) => !Number.isInteger(id))) {
      return res.status(400).json({
        message: "Uno o más IDs de categoría no son válidos",
      });
    }

    const categoriasExistentes = await prisma.categoria.findMany({
      where: {
        id: {
          in: idsNormalizados,
        },
        estaActiva: true,
      },
      select: {
        id: true,
        nombre: true,
      },
    });

    if (categoriasExistentes.length !== idsNormalizados.length) {
      return res.status(400).json({
        message: "Una o más categorías no existen o están inactivas",
      });
    }

    await prisma.perfilTrabajadorCategoria.createMany({
      data: idsNormalizados.map((categoriaId) => ({
        perfilTrabajadorId: perfil.id,
        categoriaId,
      })),
      skipDuplicates: true,
    });

    const categoriasAsignadas =
      await prisma.perfilTrabajadorCategoria.findMany({
        where: {
          perfilTrabajadorId: perfil.id,
        },
        select: {
          categoria: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
            },
          },
        },
        orderBy: {
          categoriaId: "asc",
        },
      });

    res.json({
      message: "Categorías asignadas correctamente",
      categorias: categoriasAsignadas.map((item) => item.categoria),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al asignar las categorías",
    });
  }
}


export async function obtenerCategoriasMiPerfil(req, res) {
  try {
    const usuarioId = req.usuario.usuarioId;

    const perfil = await prisma.perfilTrabajador.findUnique({
      where: {
        usuarioId,
      },
      select: {
        id: true,
        categorias: {
          select: {
            categoria: {
              select: {
                id: true,
                nombre: true,
                descripcion: true,
                estaActiva: true,
              },
            },
          },
          orderBy: {
            categoriaId: "asc",
          },
        },
      },
    });

    if (!perfil) {
      return res.status(404).json({
        message: "No posee un perfil de trabajador",
      });
    }

    res.json({
      categorias: perfil.categorias.map((item) => item.categoria),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener las categorías",
    });
  }
}