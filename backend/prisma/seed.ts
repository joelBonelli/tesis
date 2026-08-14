import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
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
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });