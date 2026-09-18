import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export async function autenticar(req, res, next) {
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
    const datosToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: datosToken.usuarioId,
      },
      select: {
        id: true,
        estaActivo: true,
      },
    });

    if (!usuario) {
      return res.status(401).json({
        message: "Usuario no encontrado",
      });
    }

    if (!usuario.estaActivo) {
      return res.status(403).json({
        message: "El usuario se encuentra inactivo",
      });
    }

    req.usuario = datosToken;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o vencido",
    });
  }
}