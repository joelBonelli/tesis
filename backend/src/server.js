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


app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});