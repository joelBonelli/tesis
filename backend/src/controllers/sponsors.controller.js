import prisma from "../lib/prisma.js";

export async function crearSponsor(req, res) {
    try {
        const usuarioId = req.usuario.usuarioId;

        const {
            razonSocial,
            nombreFantasia,
            cuit,
            email,
            telefono,
            direccion,
            descripcion,
            logoUrl,
        } = req.body ?? {};

        if (!razonSocial || !nombreFantasia || !cuit || !email) {
            return res.status(400).json({
                message:
                    "Razón social, nombre de fantasía, CUIT y email son obligatorios",
            });
        }

        const sponsorExistente = await prisma.sponsor.findUnique({
            where: {
                cuit,
            },
        });

        if (sponsorExistente) {
            return res.status(409).json({
                message: "Ya existe un Sponsor registrado con ese CUIT",
            });
        }

        const sponsor = await prisma.sponsor.create({
            data: {
                razonSocial,
                nombreFantasia,
                cuit,
                email,
                telefono: telefono ?? null,
                direccion: direccion ?? null,
                descripcion: descripcion ?? null,
                logoUrl: logoUrl ?? null,

                administradores: {
                    create: {
                        usuarioId,
                    },
                },
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
            },
        });

        res.status(201).json({
            message: "Sponsor registrado correctamente",
            sponsor,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al registrar el Sponsor",
        });
    }
}


export async function obtenerMisSponsors(req, res) {
    try {
        const usuarioId = req.usuario.usuarioId;

        const sponsors = await prisma.sponsor.findMany({
            where: {
                administradores: {
                    some: {
                        usuarioId,
                    },
                },
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
            },

            orderBy: {
                nombreFantasia: "asc",
            },
        });

        res.json({
            sponsors,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al obtener los Sponsors",
        });
    }
}


export async function solicitarPatrocinio(req, res) {
    try {
        const usuarioId = req.usuario.usuarioId;
        const sponsorId = Number(req.params.id);

        if (!Number.isInteger(sponsorId)) {
            return res.status(400).json({
                message: "El ID del Sponsor no es válido",
            });
        }

        // Buscar perfil profesional del trabajador autenticado
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

        // Verificar que el Sponsor exista
        const sponsor = await prisma.sponsor.findUnique({
            where: {
                id: sponsorId,
            },
            select: {
                id: true,
                nombreFantasia: true,
                estaActivo: true,
            },
        });

        if (!sponsor) {
            return res.status(404).json({
                message: "Sponsor no encontrado",
            });
        }

        if (!sponsor.estaActivo) {
            return res.status(400).json({
                message: "El Sponsor se encuentra inactivo",
            });
        }

        const administradores = await prisma.usuarioSponsor.findMany({
            where: {
                sponsorId,
            },
            select: {
                usuarioId: true,
            },
        });

        const patrocinioExistente = await prisma.patrocinio.findUnique({
            where: {
                sponsorId_perfilTrabajadorId: {
                    sponsorId,
                    perfilTrabajadorId: perfil.id,
                },
            },
        });

        if (patrocinioExistente) {
            if (patrocinioExistente.estado === "PENDIENTE") {
                return res.status(409).json({
                    message: "Ya posee una solicitud de patrocinio pendiente",
                });
            }

            if (patrocinioExistente.estado === "APROBADO") {
                return res.status(409).json({
                    message: "Ya posee un patrocinio aprobado con este Sponsor",
                });
            }

            // Si anteriormente fue rechazada, permitimos volver a solicitar
            const patrocinio = await prisma.patrocinio.update({
                where: {
                    id: patrocinioExistente.id,
                },
                data: {
                    estado: "PENDIENTE",
                    fechaSolicitud: new Date(),
                    fechaResolucion: null,
                    observacion: null,
                    estaActivo: true,
                },
                select: {
                    id: true,
                    estado: true,
                    fechaSolicitud: true,
                    sponsor: {
                        select: {
                            id: true,
                            nombreFantasia: true,
                        },
                    },
                },
            });

            if (administradores.length > 0) {
                await prisma.notificacion.createMany({
                    data: administradores.map((administrador) => ({
                        usuarioId: administrador.usuarioId,
                        tipo: "PATROCINIO_SOLICITADO",
                        titulo: "Nueva solicitud de patrocinio",
                        mensaje: `Se recibió una nueva solicitud de patrocinio`,
                        referenciaId: patrocinio.id,
                    })),
                });
            }

            return res.json({
                message: "Solicitud de patrocinio enviada nuevamente",
                patrocinio,
            });
        }

        const patrocinio = await prisma.patrocinio.create({
            data: {
                sponsorId,
                perfilTrabajadorId: perfil.id,
            },
            select: {
                id: true,
                estado: true,
                fechaSolicitud: true,

                sponsor: {
                    select: {
                        id: true,
                        nombreFantasia: true,
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

        if (administradores.length > 0) {
            await prisma.notificacion.createMany({
                data: administradores.map((administrador) => ({
                    usuarioId: administrador.usuarioId,
                    tipo: "PATROCINIO_SOLICITADO",
                    titulo: "Nueva solicitud de patrocinio",
                    mensaje: `${patrocinio.perfilTrabajador.usuario.nombre} ${patrocinio.perfilTrabajador.usuario.apellido} solicitó el patrocinio de ${patrocinio.sponsor.nombreFantasia}`,
                    referenciaId: patrocinio.id,
                })),
            });
        }

        res.status(201).json({
            message: "Solicitud de patrocinio enviada correctamente",
            patrocinio,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al solicitar el patrocinio",
        });
    }
}

export async function obtenerPatrociniosSponsor(req, res) {
    try {
        const usuarioId = req.usuario.usuarioId;
        const sponsorId = Number(req.params.id);

        if (!Number.isInteger(sponsorId)) {
            return res.status(400).json({
                message: "El ID del Sponsor no es válido",
            });
        }

        // Verificar que el usuario administre este Sponsor
        const administracion = await prisma.usuarioSponsor.findUnique({
            where: {
                usuarioId_sponsorId: {
                    usuarioId,
                    sponsorId,
                },
            },
        });

        if (!administracion) {
            return res.status(403).json({
                message: "No tiene permisos para administrar este Sponsor",
            });
        }

        const patrocinios = await prisma.patrocinio.findMany({
            where: {
                sponsorId,
            },

            select: {
                id: true,
                estado: true,
                fechaSolicitud: true,
                fechaResolucion: true,
                observacion: true,
                estaActivo: true,

                perfilTrabajador: {
                    select: {
                        id: true,
                        tituloProfesional: true,
                        zonaTrabajo: true,
                        aniosExperiencia: true,
                        calificacion: true,
                        trabajosRealizados: true,

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
                fechaSolicitud: "desc",
            },
        });

        const patrociniosFormateados = patrocinios.map((item) => ({
            ...item,

            perfilTrabajador: {
                ...item.perfilTrabajador,
                categorias: item.perfilTrabajador.categorias.map(
                    (categoria) => categoria.categoria
                ),
            },
        }));

        res.json({
            patrocinios: patrociniosFormateados,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al obtener las solicitudes de patrocinio",
        });
    }
}


export async function resolverPatrocinio(req, res) {
    try {
        const usuarioId = req.usuario.usuarioId;
        const sponsorId = Number(req.params.sponsorId);
        const patrocinioId = Number(req.params.patrocinioId);

        const {
            estado,
            observacion,
        } = req.body ?? {};

        if (
            !Number.isInteger(sponsorId) ||
            !Number.isInteger(patrocinioId)
        ) {
            return res.status(400).json({
                message: "Los IDs indicados no son válidos",
            });
        }

        if (!["APROBADO", "RECHAZADO"].includes(estado)) {
            return res.status(400).json({
                message: "El estado debe ser APROBADO o RECHAZADO",
            });
        }

        // Verificar que Juan realmente administre este Sponsor
        const administracion = await prisma.usuarioSponsor.findUnique({
            where: {
                usuarioId_sponsorId: {
                    usuarioId,
                    sponsorId,
                },
            },
        });

        if (!administracion) {
            return res.status(403).json({
                message: "No tiene permisos para administrar este Sponsor",
            });
        }

        const patrocinio = await prisma.patrocinio.findUnique({
            where: {
                id: patrocinioId,
            },
        });

        if (!patrocinio) {
            return res.status(404).json({
                message: "Solicitud de patrocinio no encontrada",
            });
        }

        if (patrocinio.sponsorId !== sponsorId) {
            return res.status(400).json({
                message: "El patrocinio no corresponde a este Sponsor",
            });
        }

        if (patrocinio.estado !== "PENDIENTE") {
            return res.status(400).json({
                message: "La solicitud de patrocinio ya fue resuelta",
            });
        }

        const patrocinioActualizado = await prisma.patrocinio.update({
            where: {
                id: patrocinioId,
            },

            data: {
                estado,
                observacion: observacion ?? null,
                fechaResolucion: new Date(),
                estaActivo: estado === "APROBADO",
            },

            select: {
                id: true,
                estado: true,
                fechaSolicitud: true,
                fechaResolucion: true,
                observacion: true,
                estaActivo: true,

                sponsor: {
                    select: {
                        id: true,
                        nombreFantasia: true,
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
                usuarioId:
                    patrocinioActualizado.perfilTrabajador.usuario.id,

                tipo:
                    estado === "APROBADO"
                        ? "PATROCINIO_APROBADO"
                        : "PATROCINIO_RECHAZADO",

                titulo:
                    estado === "APROBADO"
                        ? "Patrocinio aprobado"
                        : "Patrocinio rechazado",

                mensaje:
                    estado === "APROBADO"
                        ? `${patrocinioActualizado.sponsor.nombreFantasia} aprobó tu solicitud de patrocinio`
                        : `${patrocinioActualizado.sponsor.nombreFantasia} rechazó tu solicitud de patrocinio`,

                referenciaId: patrocinioActualizado.id,
            },
        });

        res.json({
            message:
                estado === "APROBADO"
                    ? "Patrocinio aprobado correctamente"
                    : "Patrocinio rechazado correctamente",

            patrocinio: patrocinioActualizado,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al resolver el patrocinio",
        });
    }
}


export async function verificarSponsor(req, res) {
    try {
        const sponsorId = Number(req.params.id);

        if (!Number.isInteger(sponsorId)) {
            return res.status(400).json({
                message: "El ID del Sponsor no es válido",
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

        if (!sponsor.estaActivo) {
            return res.status(400).json({
                message: "No se puede verificar un Sponsor inactivo",
            });
        }

        if (sponsor.estaVerificado) {
            return res.status(409).json({
                message: "El Sponsor ya se encuentra verificado",
            });
        }

        const sponsorActualizado = await prisma.sponsor.update({
            where: {
                id: sponsorId,
            },
            data: {
                estaVerificado: true,
            },
            select: {
                id: true,
                razonSocial: true,
                nombreFantasia: true,
                cuit: true,
                estaActivo: true,
                estaVerificado: true,
            },
        });

        res.json({
            message: "Sponsor verificado correctamente",
            sponsor: sponsorActualizado,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al verificar el Sponsor",
        });
    }
}


export async function obtenerMisPatrocinios(req, res) {
    try {
        const usuarioId = req.usuario.usuarioId;

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

        const patrocinios = await prisma.patrocinio.findMany({
            where: {
                perfilTrabajadorId: perfil.id,
            },

            select: {
                id: true,
                estado: true,
                fechaSolicitud: true,
                fechaResolucion: true,
                observacion: true,
                estaActivo: true,

                sponsor: {
                    select: {
                        id: true,
                        razonSocial: true,
                        nombreFantasia: true,
                        descripcion: true,
                        logoUrl: true,
                        estaActivo: true,
                        estaVerificado: true,
                    },
                },
            },

            orderBy: {
                fechaSolicitud: "desc",
            },
        });

        res.json({
            patrocinios,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al obtener los patrocinios",
        });
    }
}