import prisma from "../lib/prisma.js";

export async function obtenerMisNotificaciones(req, res) {
  try {
    const usuarioId = req.usuario.usuarioId;

    const notificaciones = await prisma.notificacion.findMany({
      where: {
        usuarioId,
      },

      select: {
        id: true,
        tipo: true,
        titulo: true,
        mensaje: true,
        referenciaId: true,
        leida: true,
        fechaCreacion: true,
      },

      orderBy: {
        fechaCreacion: "desc",
      },
    });

    const cantidadNoLeidas = notificaciones.filter(
      (notificacion) => !notificacion.leida
    ).length;

    res.json({
      cantidadNoLeidas,
      notificaciones,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener las notificaciones",
    });
  }
}


export async function marcarNotificacionComoLeida(req, res) {
  try {
    const usuarioId = req.usuario.usuarioId;
    const notificacionId = Number(req.params.id);

    if (!Number.isInteger(notificacionId)) {
      return res.status(400).json({
        message: "El ID de la notificación no es válido",
      });
    }

    const notificacion = await prisma.notificacion.findUnique({
      where: {
        id: notificacionId,
      },
    });

    if (!notificacion) {
      return res.status(404).json({
        message: "Notificación no encontrada",
      });
    }

    if (notificacion.usuarioId !== usuarioId) {
      return res.status(403).json({
        message: "No tiene permisos para modificar esta notificación",
      });
    }

    const notificacionActualizada = await prisma.notificacion.update({
      where: {
        id: notificacionId,
      },
      data: {
        leida: true,
      },
      select: {
        id: true,
        tipo: true,
        titulo: true,
        mensaje: true,
        referenciaId: true,
        leida: true,
        fechaCreacion: true,
      },
    });

    res.json({
      message: "Notificación marcada como leída",
      notificacion: notificacionActualizada,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar la notificación",
    });
  }
}


export async function marcarTodasComoLeidas(req, res) {
  try {
    const usuarioId = req.usuario.usuarioId;

    const resultado = await prisma.notificacion.updateMany({
      where: {
        usuarioId,
        leida: false,
      },
      data: {
        leida: true,
      },
    });

    res.json({
      message: "Notificaciones marcadas como leídas",
      notificacionesActualizadas: resultado.count,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar las notificaciones",
    });
  }
}