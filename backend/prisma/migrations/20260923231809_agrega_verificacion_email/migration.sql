-- CreateTable
CREATE TABLE "VerificacionEmail" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tokenHash" VARCHAR(64) NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaExpiracion" TIMESTAMP(3) NOT NULL,
    "utilizado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VerificacionEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificacionEmail_usuarioId_key" ON "VerificacionEmail"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificacionEmail_tokenHash_key" ON "VerificacionEmail"("tokenHash");

-- AddForeignKey
ALTER TABLE "VerificacionEmail" ADD CONSTRAINT "VerificacionEmail_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
