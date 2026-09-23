import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import crypto from "crypto";



export async function login(req, res) {
    try {
        const { email, password } = req.body ?? {};

        if (!email || !password) {
            return res.status(400).json({
                message: "Email y contraseña son obligatorios",
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: {
                email,
            },
            include: {
                roles: {
                    include: {
                        rol: true,
                    },
                },
            },
        });

        if (!usuario) {
            return res.status(401).json({
                message: "Email o contraseña incorrectos",
            });
        }

        if (!usuario.estaActivo) {
            return res.status(403).json({
                message: "El usuario se encuentra inactivo",
            });
        }

        const passwordValida = await bcrypt.compare(
            password,
            usuario.passwordHash
        );

        if (!passwordValida) {
            return res.status(401).json({
                message: "Email o contraseña incorrectos",
            });
        }

        if (!usuario.estaVerificado) {
            return res.status(403).json({
                message: "Debe verificar su correo electrónico antes de iniciar sesión",
            });
        }

        const roles = usuario.roles.map((item) => item.rol.nombre);

        const token = jwt.sign(
            {
                usuarioId: usuario.id,
                email: usuario.email,
                roles,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h",
            }
        );

        res.json({
            message: "Inicio de sesión correcto",
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                estaVerificado: usuario.estaVerificado,
                roles,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al iniciar sesión",
        });
    }
}

export async function obtenerPerfil(req, res) {
    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: req.usuario.usuarioId,
            },
            select: {
                id: true,
                nombre: true,
                apellido: true,
                email: true,
                telefono: true,
                fechaNacimiento: true,
                fechaRegistro: true,
                estaActivo: true,
                estaVerificado: true,
                roles: {
                    select: {
                        rol: {
                            select: {
                                id: true,
                                nombre: true,
                                descripcion: true,
                            },
                        },
                    },
                },
            },
        });

        if (!usuario) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        res.json({
            ...usuario,
            roles: usuario.roles.map((item) => item.rol),
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al obtener el perfil",
        });
    }
}


export async function verificarEmail(req, res) {
    try {
        const { token } = req.body ?? {};

        if (!token) {
            return res.status(400).json({
                message: "Token de verificación requerido",
            });
        }

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const verificacion = await prisma.verificacionEmail.findUnique({
            where: {
                tokenHash,
            },
            include: {
                usuario: true,
            },
        });

        if (!verificacion) {
            return res.status(400).json({
                message: "Token de verificación inválido",
            });
        }

        if (verificacion.utilizado) {
            return res.status(400).json({
                message: "El enlace de verificación ya fue utilizado",
            });
        }

        if (verificacion.fechaExpiracion < new Date()) {
            return res.status(400).json({
                message: "El enlace de verificación ha vencido",
            });
        }

        await prisma.$transaction([
            prisma.usuario.update({
                where: {
                    id: verificacion.usuarioId,
                },
                data: {
                    estaVerificado: true,
                },
            }),

            prisma.verificacionEmail.update({
                where: {
                    id: verificacion.id,
                },
                data: {
                    utilizado: true,
                },
            }),
        ]);

        res.json({
            message: "Correo electrónico verificado correctamente",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al verificar el correo electrónico",
        });
    }
}