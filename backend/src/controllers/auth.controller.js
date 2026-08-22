import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

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