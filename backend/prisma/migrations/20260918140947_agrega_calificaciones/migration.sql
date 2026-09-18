-- CreateTable
CREATE TABLE "CalificacionServicio" (
    "id" SERIAL NOT NULL,
    "contratacionId" INTEGER NOT NULL,
    "perfilTrabajadorId" INTEGER NOT NULL,
    "puntuacion" INTEGER NOT NULL,
    "comentario" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalificacionServicio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CalificacionServicio_contratacionId_key" ON "CalificacionServicio"("contratacionId");

-- AddForeignKey
ALTER TABLE "CalificacionServicio" ADD CONSTRAINT "CalificacionServicio_contratacionId_fkey" FOREIGN KEY ("contratacionId") REFERENCES "Contratacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalificacionServicio" ADD CONSTRAINT "CalificacionServicio_perfilTrabajadorId_fkey" FOREIGN KEY ("perfilTrabajadorId") REFERENCES "PerfilTrabajador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
