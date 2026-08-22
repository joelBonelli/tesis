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