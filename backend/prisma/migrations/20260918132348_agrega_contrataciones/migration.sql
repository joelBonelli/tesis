-- CreateEnum
CREATE TYPE "EstadoContratacion" AS ENUM ('EN_PROCESO', 'FINALIZADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "Contratacion" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "propuestaId" INTEGER NOT NULL,
    "montoAcordado" DECIMAL(12,2) NOT NULL,
    "fechaContratacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFinalizacion" TIMESTAMP(3),
    "estado" "EstadoContratacion" NOT NULL DEFAULT 'EN_PROCESO',

    CONSTRAINT "Contratacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contratacion_solicitudId_key" ON "Contratacion"("solicitudId");

-- CreateIndex
CREATE UNIQUE INDEX "Contratacion_propuestaId_key" ON "Contratacion"("propuestaId");

-- AddForeignKey
ALTER TABLE "Contratacion" ADD CONSTRAINT "Contratacion_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "SolicitudServicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contratacion" ADD CONSTRAINT "Contratacion_propuestaId_fkey" FOREIGN KEY ("propuestaId") REFERENCES "PropuestaServicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
