-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('PUBLICADA', 'EN_PROCESO', 'FINALIZADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "SolicitudServicio" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "titulo" VARCHAR(120) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "zona" VARCHAR(120),
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'PUBLICADA',

    CONSTRAINT "SolicitudServicio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SolicitudServicio" ADD CONSTRAINT "SolicitudServicio_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudServicio" ADD CONSTRAINT "SolicitudServicio_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
