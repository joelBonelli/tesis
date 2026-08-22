import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";


export async function listarUsuarios(req, res) {
    try {
        const usuarios = await prisma.usuario.findMany({
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
            },
            orderBy: {
                id: "asc",
            },
        });

        res.json(usuarios);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al obtener los usuarios",
        });
    }
}

export async function obtenerUsuarioPorId(req, res) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: "El ID del usuario no es válido",
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: {
                id,
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
            },
        });

        if (!usuario) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        res.json(usuario);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al obtener el usuario",
        });
    }
}



export async function crearUsuario(req, res) {
    try {
        const {
            nombre,
            apellido,
            email,
            password,
            telefono,
            fechaNacimiento,
        } = req.body ?? {};

        if (!nombre || !apellido || !email || !password) {
            return res.status(400).json({
                message: "Nombre, apellido, email y contraseña son obligatorios",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "La contraseña debe tener al menos 8 caracteres",
            });
        }

        const usuarioExistente = await prisma.usuario.findUnique({
            where: {
                email,
            },
        });

        if (usuarioExistente) {
            return res.status(409).json({
                message: "Ya existe un usuario registrado con ese email",
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const usuario = await prisma.usuario.create({
            data: {
                nombre,
                apellido,
                email,
                passwordHash,
                telefono: telefono ?? null,
                fechaNacimiento: fechaNacimiento
                    ? new Date(fechaNacimiento)
                    : null,
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
            },
        });

        res.status(201).json({
            message: "Usuario creado correctamente",
            usuario,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al crear el usuario",
        });
    }
}


export async function obtenerRolesUsuario(req, res) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: "El ID del usuario no es válido",
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                nombre: true,
                apellido: true,
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
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            roles: usuario.roles.map((item) => item.rol),
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al obtener los roles del usuario",
        });
    }
}



export async function asignarRolUsuario(req, res) {
    try {
        const usuarioId = Number(req.params.id);
        const { rolId } = req.body ?? {};

        if (Number.isNaN(usuarioId)) {
            return res.status(400).json({
                message: "El ID del usuario no es válido",
            });
        }

        if (!rolId) {
            return res.status(400).json({
                message: "Debe indicar un rol",
            });
        }

        const rolIdNumero = Number(rolId);

        if (Number.isNaN(rolIdNumero)) {
            return res.status(400).json({
                message: "El ID del rol no es válido",
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: {
                id: usuarioId,
            },
        });

        if (!usuario) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        const rol = await prisma.rol.findUnique({
            where: {
                id: rolIdNumero,
            },
        });

        if (!rol) {
            return res.status(404).json({
                message: "Rol no encontrado",
            });
        }

        const relacionExistente = await prisma.usuarioRol.findUnique({
            where: {
                usuarioId_rolId: {
                    usuarioId,
                    rolId: rolIdNumero,
                },
            },
        });

        if (relacionExistente) {
            return res.status(409).json({
                message: "El usuario ya tiene asignado ese rol",
            });
        }

        await prisma.usuarioRol.create({
            data: {
                usuarioId,
                rolId: rolIdNumero,
            },
        });

        res.status(201).json({
            message: "Rol asignado correctamente",
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
            },
            rol: {
                id: rol.id,
                nombre: rol.nombre,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al asignar el rol",
        });
    }
}