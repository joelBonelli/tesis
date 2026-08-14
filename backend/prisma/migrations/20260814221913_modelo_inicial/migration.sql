-- CreateEnum
CREATE TYPE "EstadoPatrocinio" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(60) NOT NULL,
    "apellido" VARCHAR(80) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(30),
    "fechaNacimiento" DATE,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "estaVerificado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(40) NOT NULL,
    "descripcion" VARCHAR(150),

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioRol" (
    "usuarioId" INTEGER NOT NULL,
    "rolId" INTEGER NOT NULL,
    "fechaAlta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY ("usuarioId","rolId")
);

-- CreateTable
CREATE TABLE "PerfilTrabajador" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tituloProfesional" VARCHAR(100),
    "descripcion" TEXT,
    "zonaTrabajo" VARCHAR(120),
    "aniosExperiencia" INTEGER,
    "calificacion" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "trabajosRealizados" INTEGER NOT NULL DEFAULT 0,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerfilTrabajador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" SERIAL NOT NULL,
    "razonSocial" VARCHAR(120) NOT NULL,
    "nombreFantasia" VARCHAR(120) NOT NULL,
    "cuit" VARCHAR(20) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "telefono" VARCHAR(30),
    "direccion" VARCHAR(180),
    "descripcion" TEXT,
    "logoUrl" TEXT,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "estaVerificado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioSponsor" (
    "usuarioId" INTEGER NOT NULL,
    "sponsorId" INTEGER NOT NULL,
    "fechaAlta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsuarioSponsor_pkey" PRIMARY KEY ("usuarioId","sponsorId")
);

-- CreateTable
CREATE TABLE "Patrocinio" (
    "id" SERIAL NOT NULL,
    "sponsorId" INTEGER NOT NULL,
    "perfilTrabajadorId" INTEGER NOT NULL,
    "estado" "EstadoPatrocinio" NOT NULL DEFAULT 'PENDIENTE',
    "fechaSolicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaResolucion" TIMESTAMP(3),
    "observacion" TEXT,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Patrocinio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "PerfilTrabajador_usuarioId_key" ON "PerfilTrabajador"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Sponsor_cuit_key" ON "Sponsor"("cuit");

-- CreateIndex
CREATE UNIQUE INDEX "Patrocinio_sponsorId_perfilTrabajadorId_key" ON "Patrocinio"("sponsorId", "perfilTrabajadorId");

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilTrabajador" ADD CONSTRAINT "PerfilTrabajador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioSponsor" ADD CONSTRAINT "UsuarioSponsor_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioSponsor" ADD CONSTRAINT "UsuarioSponsor_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patrocinio" ADD CONSTRAINT "Patrocinio_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patrocinio" ADD CONSTRAINT "Patrocinio_perfilTrabajadorId_fkey" FOREIGN KEY ("perfilTrabajadorId") REFERENCES "PerfilTrabajador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
