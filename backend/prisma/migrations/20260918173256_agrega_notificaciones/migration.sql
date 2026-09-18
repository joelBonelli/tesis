-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('PROPUESTA_RECIBIDA', 'PROPUESTA_ACEPTADA', 'PROPUESTA_RECHAZADA', 'NUEVO_MENSAJE', 'PATROCINIO_SOLICITADO', 'PATROCINIO_APROBADO', 'PATROCINIO_RECHAZADO');

-- CreateTable
CREATE TABLE "Notificacion" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "mensaje" VARCHAR(500) NOT NULL,
    "referenciaId" INTEGER,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
