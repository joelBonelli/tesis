import "dotenv/config";

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // =========================================================
  // ROLES
  // =========================================================

  const roles = [
    {
      nombre: "CLIENTE",
      descripcion: "Usuario que contrata servicios.",
    },
    {
      nombre: "TRABAJADOR",
      descripcion: "Usuario que ofrece servicios.",
    },
    {
      nombre: "ADMINISTRADOR",
      descripcion: "Usuario con permisos de administración del sistema.",
    },
  ];

  for (const rol of roles) {
    await prisma.rol.upsert({
      where: {
        nombre: rol.nombre,
      },
      update: {
        descripcion: rol.descripcion,
      },
      create: rol,
    });
  }

  console.log("Roles iniciales creados correctamente.");

  // =========================================================
  // CATEGORÍAS
  // =========================================================

  const categorias = [
    {
      nombre: "Plomería",
      descripcion: "Instalaciones y reparaciones de agua y sanitarios.",
    },
    {
      nombre: "Electricidad",
      descripcion: "Instalaciones y reparaciones eléctricas.",
    },
    {
      nombre: "Gas",
      descripcion: "Instalaciones, mantenimiento y reparaciones de gas.",
    },
    {
      nombre: "Pintura",
      descripcion: "Trabajos de pintura interior y exterior.",
    },
    {
      nombre: "Limpieza",
      descripcion: "Servicios de limpieza doméstica y general.",
    },
    {
      nombre: "Tecnología",
      descripcion:
        "Soporte técnico, computación, redes y asistencia tecnológica.",
    },
    {
      nombre: "Mudanzas",
      descripcion: "Servicios de mudanza y traslado.",
    },
    {
      nombre: "Jardinería",
      descripcion: "Mantenimiento de jardines y espacios verdes.",
    },
  ];

  for (const categoria of categorias) {
    await prisma.categoria.upsert({
      where: {
        nombre: categoria.nombre,
      },
      update: {
        descripcion: categoria.descripcion,
        estaActiva: true,
      },
      create: {
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
      },
    });
  }

  console.log("Categorías iniciales creadas correctamente.");
}

main()
  .catch((error) => {
    console.error("Error ejecutando seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });