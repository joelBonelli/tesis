-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "descripcion" TEXT,
    "estaActiva" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerfilTrabajadorCategoria" (
    "perfilTrabajadorId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "PerfilTrabajadorCategoria_pkey" PRIMARY KEY ("perfilTrabajadorId","categoriaId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- AddForeignKey
ALTER TABLE "PerfilTrabajadorCategoria" ADD CONSTRAINT "PerfilTrabajadorCategoria_perfilTrabajadorId_fkey" FOREIGN KEY ("perfilTrabajadorId") REFERENCES "PerfilTrabajador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilTrabajadorCategoria" ADD CONSTRAINT "PerfilTrabajadorCategoria_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
