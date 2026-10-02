import prisma from "../lib/prisma.js";

export function autorizarRoles(...rolesPermitidos) {
    return async (req, res, next) => {
        try {
            if (!req.usuario) {
                return res.status(401).json({
                    message: "Usuario no autenticado",
                });
            }

            const usuario = await prisma.usuario.findUnique({
                where: {
                    id: req.usuario.usuarioId,
                },
                select: {
                    roles: {
                        select: {
                            rol: {
                                select: {
                                    nombre: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!usuario) {
                return res.status(401).json({
                    message: "Usuario no encontrado",
                });
            }

            const rolesUsuario = usuario.roles.map(
                (item) => item.rol.nombre
            );

            const tienePermiso = rolesPermitidos.some((rol) =>
                rolesUsuario.includes(rol)
            );

            if (!tienePermiso) {
                return res.status(403).json({
                    message: "No tiene permisos para realizar esta acción",
                });
            }

            req.usuario.roles = rolesUsuario;

            next();
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Error al validar los permisos del usuario",
            });
        }
    };
}