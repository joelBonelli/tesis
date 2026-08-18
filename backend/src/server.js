import express from "express";
import cors from "cors";
import "dotenv/config";
import prisma from "./lib/prisma.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API de Trabajito funcionando correctamente",
  });
});

const PORT = process.env.PORT || 3000;



// ROLES

app.get("/api/roles", async (req, res) => {
  try {
    const roles = await prisma.rol.findMany();

    res.json(roles);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener los roles",
    });
  }
});


app.get("/api/usuarios/:id/roles", async (req, res) => {
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
});


// USUARIOS

app.post("/api/usuarios", async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      passwordHash,
      telefono,
      fechaNacimiento,
    } = req.body;

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        email,
        passwordHash,
        telefono,
        fechaNacimiento: fechaNacimiento
          ? new Date(fechaNacimiento)
          : null,
      },
    });

    res.status(201).json(usuario);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al crear el usuario",
    });
  }
});



app.get("/api/usuarios", async (req, res) => {
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
});



app.get("/api/usuarios/:id", async (req, res) => {
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
});



app.post("/api/usuarios/:id/roles", async (req, res) => {
  try {
    const usuarioId = Number(req.params.id);
    const { rolId } = req.body;

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
        id: Number(rolId),
      },
    });

    if (!rol) {
      return res.status(404).json({
        message: "Rol no encontrado",
      });
    }

    const relacionExistente = await prisma.usuarioRol.findFirst({
      where: {
        usuarioId,
        rolId: Number(rolId),
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
        rolId: Number(rolId),
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
});




app.post("/api/usuarios/:id/perfil-trabajador", async (req, res) => {
  try {
    const usuarioId = Number(req.params.id);

    const {
      tituloProfesional,
      descripcion,
      zonaTrabajo,
      aniosExperiencia,
    } = req.body;

    if (Number.isNaN(usuarioId)) {
      return res.status(400).json({
        message: "El ID del usuario no es válido",
      });
    }

    if (
      aniosExperiencia !== undefined &&
      (!Number.isInteger(Number(aniosExperiencia)) ||
        Number(aniosExperiencia) < 0)
    ) {
      return res.status(400).json({
        message: "Los años de experiencia no son válidos",
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        roles: {
          select: {
            rol: {
              select: {
                nombre: true,
              },
            },
          },
        },
        perfilTrabajador: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const tieneRolTrabajador = usuario.roles.some(
      (usuarioRol) => usuarioRol.rol.nombre === "TRABAJADOR"
    );

    if (!tieneRolTrabajador) {
      return res.status(403).json({
        message: "El usuario no posee el rol TRABAJADOR",
      });
    }

    if (usuario.perfilTrabajador) {
      return res.status(409).json({
        message: "El usuario ya posee un perfil de trabajador",
      });
    }

    const perfil = await prisma.perfilTrabajador.create({
      data: {
        usuarioId,
        tituloProfesional: tituloProfesional ?? null,
        descripcion: descripcion ?? null,
        zonaTrabajo: zonaTrabajo ?? null,
        aniosExperiencia:
          aniosExperiencia !== undefined
            ? Number(aniosExperiencia)
            : null,
      },
      select: {
        id: true,
        usuarioId: true,
        tituloProfesional: true,
        descripcion: true,
        zonaTrabajo: true,
        aniosExperiencia: true,
        calificacion: true,
        trabajosRealizados: true,
        disponible: true,
        fechaCreacion: true,
      },
    });

    res.status(201).json({
      message: "Perfil de trabajador creado correctamente",
      perfil,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al crear el perfil de trabajador",
    });
  }
});



app.get("/api/usuarios/:id/perfil-trabajador", async (req, res) => {
  try {
    const usuarioId = Number(req.params.id);

    if (Number.isNaN(usuarioId)) {
      return res.status(400).json({
        message: "El ID del usuario no es válido",
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        perfilTrabajador: {
          select: {
            id: true,
            tituloProfesional: true,
            descripcion: true,
            zonaTrabajo: true,
            aniosExperiencia: true,
            calificacion: true,
            trabajosRealizados: true,
            disponible: true,
            fechaCreacion: true,
          },
        },
      },
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    if (!usuario.perfilTrabajador) {
      return res.status(404).json({
        message: "El usuario no posee un perfil de trabajador",
      });
    }

    res.json({
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
      },
      perfilTrabajador: usuario.perfilTrabajador,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener el perfil de trabajador",
    });
  }
});










app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});