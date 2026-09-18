-- CreateEnum
CREATE TYPE "EstadoPropuesta" AS ENUM ('PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'RETIRADA');

-- CreateTable
CREATE TABLE "PropuestaServicio" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "perfilTrabajadorId" INTEGER NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "mensaje" TEXT,
    "diasEstimados" INTEGER,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoPropuesta" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "PropuestaServicio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PropuestaServicio_solicitudId_perfilTrabajadorId_key" ON "PropuestaServicio"("solicitudId", "perfilTrabajadorId");

-- AddForeignKey
ALTER TABLE "PropuestaServicio" ADD CONSTRAINT "PropuestaServicio_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "SolicitudServicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropuestaServicio" ADD CONSTRAINT "PropuestaServicio_perfilTrabajadorId_fkey" FOREIGN KEY ("perfilTrabajadorId") REFERENCES "PerfilTrabajador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
