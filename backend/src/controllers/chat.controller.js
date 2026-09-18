import prisma from "../lib/prisma.js";

async function obtenerContratacionYValidarUsuario(
    contratacionId,
    usuarioId
) {
    const contratacion = await prisma.contratacion.findUnique({
        where: {
            id: contratacionId,
        },
        select: {
            id: true,

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
        return {
            error: "Contratación no encontrada",
            status: 404,
        };
    }

    const esCliente =
        contratacion.solicitud.clienteId === usuarioId;

    const esTrabajador =
        contratacion.propuesta.perfilTrabajador.usuarioId === usuarioId;

    if (!esCliente && !esTrabajador) {
        return {
            error: "No tiene permisos para acceder a esta conversación",
            status: 403,
        };
    }

    return {
        contratacion,
    };
}


export async function enviarMensaje(req, res) {
    try {
        const usuarioId = req.usuario.usuarioId;
        const contratacionId = Number(req.params.id);
        const { contenido } = req.body ?? {};

        if (!Number.isInteger(contratacionId)) {
            return res.status(400).json({
                message: "El ID de la contratación no es válido",
            });
        }

        if (
            typeof contenido !== "string" ||
            contenido.trim().length === 0
        ) {
            return res.status(400).json({
                message: "El mensaje no puede estar vacío",
            });
        }

        if (contenido.trim().length > 2000) {
            return res.status(400).json({
                message: "El mensaje no puede superar los 2000 caracteres",
            });
        }

        const validacion =
            await obtenerContratacionYValidarUsuario(
                contratacionId,
                usuarioId
            );

        if (validacion.error) {
            return res.status(validacion.status).json({
                message: validacion.error,
            });
        }

        const clienteId =
            validacion.contratacion.solicitud.clienteId;

        const trabajadorId =
            validacion.contratacion.propuesta.perfilTrabajador.usuarioId;

        const destinatarioId =
            usuarioId === clienteId
                ? trabajadorId
                : clienteId;

        // Si todavía no existe conversación, se crea automáticamente.
        const conversacion = await prisma.conversacion.upsert({
            where: {
                contratacionId,
            },
            update: {},
            create: {
                contratacionId,
            },
        });

        const mensaje = await prisma.mensaje.create({
            data: {
                conversacionId: conversacion.id,
                remitenteId: usuarioId,
                contenido: contenido.trim(),
            },

            select: {
                id: true,
                contenido: true,
                fechaEnvio: true,
                leido: true,

                remitente: {
                    select: {
                        id: true,
                        nombre: true,
                        apellido: true,
                    },
                },
            },
        });

        await prisma.notificacion.create({
            data: {
                usuarioId: destinatarioId,
                tipo: "NUEVO_MENSAJE",
                titulo: "Nuevo mensaje",
                mensaje: `${mensaje.remitente.nombre} ${mensaje.remitente.apellido} te envió un mensaje`,
                referenciaId: contratacionId,
            },
        });

        res.status(201).json({
            message: "Mensaje enviado correctamente",
            mensaje,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al enviar el mensaje",
        });
    }
}



export async function obtenerMensajes(req, res) {
    try {
        const usuarioId = req.usuario.usuarioId;
        const contratacionId = Number(req.params.id);

        if (!Number.isInteger(contratacionId)) {
            return res.status(400).json({
                message: "El ID de la contratación no es válido",
            });
        }

        const validacion =
            await obtenerContratacionYValidarUsuario(
                contratacionId,
                usuarioId
            );

        if (validacion.error) {
            return res.status(validacion.status).json({
                message: validacion.error,
            });
        }

        const conversacion = await prisma.conversacion.findUnique({
            where: {
                contratacionId,
            },

            select: {
                id: true,
                fechaCreacion: true,

                mensajes: {
                    select: {
                        id: true,
                        contenido: true,
                        fechaEnvio: true,
                        leido: true,

                        remitente: {
                            select: {
                                id: true,
                                nombre: true,
                                apellido: true,
                            },
                        },
                    },

                    orderBy: {
                        fechaEnvio: "asc",
                    },
                },
            },
        });

        if (!conversacion) {
            return res.json({
                mensajes: [],
            });
        }

        res.json({
            conversacionId: conversacion.id,
            mensajes: conversacion.mensajes,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al obtener los mensajes",
        });
    }
}


export async function marcarMensajesComoLeidos(req, res) {
    try {
        const usuarioId = req.usuario.usuarioId;
        const contratacionId = Number(req.params.id);

        if (!Number.isInteger(contratacionId)) {
            return res.status(400).json({
                message: "El ID de la contratación no es válido",
            });
        }

        const validacion =
            await obtenerContratacionYValidarUsuario(
                contratacionId,
                usuarioId
            );

        if (validacion.error) {
            return res.status(validacion.status).json({
                message: validacion.error,
            });
        }

        const conversacion = await prisma.conversacion.findUnique({
            where: {
                contratacionId,
            },
            select: {
                id: true,
            },
        });

        if (!conversacion) {
            return res.json({
                message: "No hay mensajes para marcar como leídos",
                mensajesActualizados: 0,
            });
        }

        const resultado = await prisma.mensaje.updateMany({
            where: {
                conversacionId: conversacion.id,

                // Solo mensajes enviados por la otra persona
                remitenteId: {
                    not: usuarioId,
                },

                leido: false,
            },

            data: {
                leido: true,
            },
        });

        res.json({
            message: "Mensajes marcados como leídos",
            mensajesActualizados: resultado.count,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al marcar los mensajes como leídos",
        });
    }
}