import jwt from "jsonwebtoken";

export function autenticar(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            message: "Token de autenticación requerido",
        });
    }

    const [tipo, token] = authorization.split(" ");

    if (tipo !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Formato de token inválido",
        });
    }

    try {
        const datosToken = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = datosToken;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token inválido o vencido",
        });
    }
}