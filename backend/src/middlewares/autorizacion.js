export function autorizarRoles(...rolesPermitidos) {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({
                message: "Usuario no autenticado",
            });
        }

        const rolesUsuario = req.usuario.roles || [];

        const tienePermiso = rolesPermitidos.some((rol) =>
            rolesUsuario.includes(rol)
        );

        if (!tienePermiso) {
            return res.status(403).json({
                message: "No tiene permisos para realizar esta acción",
            });
        }

        next();
    };
}