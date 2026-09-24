import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import crypto from "crypto";
import transporter from "../lib/mailer.js";



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
            if (verificacion.usuario.estaVerificado) {
                return res.json({
                    message: "Tu correo electrónico ya se encuentra verificado",
                    yaVerificado: true,
                });
            }

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


export async function reenviarVerificacion(req, res) {
    try {
        const { email } = req.body ?? {};

        if (!email) {
            return res.status(400).json({
                message: "El email es obligatorio",
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: {
                email,
            },
        });

        // Respuesta genérica para no revelar si un email está registrado
        if (!usuario) {
            return res.json({
                message:
                    "Si existe una cuenta pendiente de verificación con ese email, se enviará un nuevo enlace.",
            });
        }

        if (usuario.estaVerificado) {
            return res.json({
                message:
                    "Si existe una cuenta pendiente de verificación con ese email, se enviará un nuevo enlace.",
            });
        }

        const token = crypto.randomBytes(32).toString("hex");

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const fechaExpiracion = new Date(
            Date.now() + 24 * 60 * 60 * 1000
        );

        await prisma.verificacionEmail.upsert({
            where: {
                usuarioId: usuario.id,
            },
            update: {
                tokenHash,
                fechaCreacion: new Date(),
                fechaExpiracion,
                utilizado: false,
            },
            create: {
                usuarioId: usuario.id,
                tokenHash,
                fechaExpiracion,
            },
        });

        const urlVerificacion =
            `${process.env.FRONTEND_URL}/verificar-email?token=${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: usuario.email,
            subject: "Confirmá tu cuenta - Al Rescate",
            text: `
Hola ${usuario.nombre}.

Solicitaste un nuevo enlace para verificar tu cuenta en Al Rescate.

Confirmá tu correo ingresando al siguiente enlace:

${urlVerificacion}

El enlace tiene una validez de 24 horas.
            `,
            html: `
                <h2>¡Hola ${usuario.nombre}!</h2>

                <p>
                    Solicitaste un nuevo enlace para verificar tu cuenta en
                    <strong>Al Rescate</strong>.
                </p>

                <p>
                    <a href="${urlVerificacion}">
                        Confirmar mi correo
                    </a>
                </p>

                <p>Este enlace tiene una validez de 24 horas.</p>
            `,
        });

        res.json({
            message:
                "Si existe una cuenta pendiente de verificación con ese email, se enviará un nuevo enlace.",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al reenviar el correo de verificación",
        });
    }
}

export async function solicitarRecuperacionPassword(req, res) {
    try {
        const { email } = req.body ?? {};

        if (!email) {
            return res.status(400).json({
                message: "El email es obligatorio",
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: {
                email,
            },
        });

        const mensajeGenerico =
            "Si existe una cuenta asociada a ese email, recibirás un enlace para restablecer tu contraseña.";

        // No revelamos si el email existe o no
        if (!usuario || !usuario.estaActivo) {
            return res.json({
                message: mensajeGenerico,
            });
        }

        const token = crypto.randomBytes(32).toString("hex");

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const fechaExpiracion = new Date(
            Date.now() + 60 * 60 * 1000
        );

        await prisma.recuperacionPassword.upsert({
            where: {
                usuarioId: usuario.id,
            },
            update: {
                tokenHash,
                fechaCreacion: new Date(),
                fechaExpiracion,
                utilizado: false,
            },
            create: {
                usuarioId: usuario.id,
                tokenHash,
                fechaExpiracion,
            },
        });

        const urlRecuperacion =
            `${process.env.FRONTEND_URL}/restablecer-password?token=${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: usuario.email,
            subject: "Restablecé tu contraseña - Al Rescate",
            text: `
Hola ${usuario.nombre}.

Recibimos una solicitud para restablecer tu contraseña.

Ingresá al siguiente enlace:

${urlRecuperacion}

El enlace tiene una validez de 1 hora.

Si no solicitaste este cambio, podés ignorar este correo.
            `,
            html: `
                <h2>¡Hola ${usuario.nombre}!</h2>

                <p>
                    Recibimos una solicitud para restablecer tu contraseña
                    de <strong>Al Rescate</strong>.
                </p>

                <p>
                    <a href="${urlRecuperacion}">
                        Restablecer mi contraseña
                    </a>
                </p>

                <p>
                    Este enlace tiene una validez de 1 hora.
                </p>

                <p>
                    Si no solicitaste este cambio, podés ignorar este correo.
                </p>
            `,
        });

        res.json({
            message: mensajeGenerico,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al solicitar la recuperación de contraseña",
        });
    }
}


export async function restablecerPassword(req, res) {
    try {
        const { token, password } = req.body ?? {};

        if (!token || !password) {
            return res.status(400).json({
                message: "Token y nueva contraseña son obligatorios",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "La contraseña debe tener al menos 8 caracteres",
            });
        }

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const recuperacion =
            await prisma.recuperacionPassword.findUnique({
                where: {
                    tokenHash,
                },
            });

        if (!recuperacion) {
            return res.status(400).json({
                message: "Token de recuperación inválido",
            });
        }

        if (recuperacion.utilizado) {
            return res.status(400).json({
                message: "El enlace de recuperación ya fue utilizado",
            });
        }

        if (recuperacion.fechaExpiracion < new Date()) {
            return res.status(400).json({
                message: "El enlace de recuperación ha vencido",
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await prisma.$transaction([
            prisma.usuario.update({
                where: {
                    id: recuperacion.usuarioId,
                },
                data: {
                    passwordHash,
                },
            }),

            prisma.recuperacionPassword.update({
                where: {
                    id: recuperacion.id,
                },
                data: {
                    utilizado: true,
                },
            }),
        ]);

        res.json({
            message: "Contraseña restablecida correctamente",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al restablecer la contraseña",
        });
    }
}