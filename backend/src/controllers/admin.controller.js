import prisma from "../lib/prisma.js";

export async function obtenerSponsorsPendientes(req, res) {
  try {
    const sponsors = await prisma.sponsor.findMany({
      where: {
        estaActivo: true,
        estaVerificado: false,
      },

      select: {
        id: true,
        razonSocial: true,
        nombreFantasia: true,
        cuit: true,
        email: true,
        telefono: true,
        direccion: true,
        descripcion: true,
        logoUrl: true,
        fechaRegistro: true,
        estaActivo: true,
        estaVerificado: true,

        administradores: {
          select: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                email: true,
              },
            },
          },
        },
      },

      orderBy: {
        fechaRegistro: "asc",
      },
    });

    res.json({
      cantidad: sponsors.length,
      sponsors,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener los Sponsors pendientes",
    });
  }
}


export async function cambiarEstadoUsuario(req, res) {
  try {
    const usuarioId = Number(req.params.id);
    const { estaActivo } = req.body ?? {};

    if (!Number.isInteger(usuarioId)) {
      return res.status(400).json({
        message: "El ID del usuario no es válido",
      });
    }

    if (typeof estaActivo !== "boolean") {
      return res.status(400).json({
        message: "Debe indicar el estado del usuario",
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        estaActivo: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: {
        id: usuarioId,
      },
      data: {
        estaActivo,
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        estaActivo: true,
      },
    });

    res.json({
      message: estaActivo
        ? "Usuario activado correctamente"
        : "Usuario desactivado correctamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar el estado del usuario",
    });
  }
}


export async function cambiarEstadoSponsor(req, res) {
  try {
    const sponsorId = Number(req.params.id);
    const { estaActivo } = req.body ?? {};

    if (!Number.isInteger(sponsorId)) {
      return res.status(400).json({
        message: "El ID del Sponsor no es válido",
      });
    }

    if (typeof estaActivo !== "boolean") {
      return res.status(400).json({
        message: "Debe indicar el estado del Sponsor",
      });
    }

    const sponsor = await prisma.sponsor.findUnique({
      where: {
        id: sponsorId,
      },
      select: {
        id: true,
        nombreFantasia: true,
        estaActivo: true,
        estaVerificado: true,
      },
    });

    if (!sponsor) {
      return res.status(404).json({
        message: "Sponsor no encontrado",
      });
    }

    const sponsorActualizado = await prisma.sponsor.update({
      where: {
        id: sponsorId,
      },
      data: {
        estaActivo,
      },
      select: {
        id: true,
        razonSocial: true,
        nombreFantasia: true,
        estaActivo: true,
        estaVerificado: true,
      },
    });

    res.json({
      message: estaActivo
        ? "Sponsor activado correctamente"
        : "Sponsor desactivado correctamente",
      sponsor: sponsorActualizado,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar el estado del Sponsor",
    });
  }
}