import { useEffect, useState } from "react";

import {
  Wrench,
  CheckCircle2,
  Save,
} from "lucide-react";

import {
  obtenerCategoriasActivas,
  obtenerCategoriasMiPerfil,
  actualizarCategoriasMiPerfil,
} from "../services/trabajadoresService.js";

import "./CategoriasTrabajador.css";

function CategoriasTrabajador() {
  const [categorias, setCategorias] = useState([]);
  const [seleccionadas, setSeleccionadas] =
    useState([]);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  useEffect(() => {
    async function cargarCategorias() {
      try {
        const [
          datosCategorias,
          datosSeleccionadas,
        ] = await Promise.all([
          obtenerCategoriasActivas(),
          obtenerCategoriasMiPerfil(),
        ]);

        setCategorias(datosCategorias.categorias);

        setSeleccionadas(
          datosSeleccionadas.categorias.map(
            (categoria) => categoria.id
          )
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarCategorias();
  }, []);

  function alternarCategoria(categoriaId) {
    setExito("");

    setSeleccionadas((anteriores) => {
      if (anteriores.includes(categoriaId)) {
        return anteriores.filter(
          (id) => id !== categoriaId
        );
      }

      return [...anteriores, categoriaId];
    });
  }

  async function guardarCategorias() {
    setError("");
    setExito("");

    if (seleccionadas.length === 0) {
      setError(
        "Seleccioná al menos un oficio o categoría."
      );
      return;
    }

    setGuardando(true);

    try {
      await actualizarCategoriasMiPerfil(
        seleccionadas
      );

      setExito(
        "Tus oficios fueron actualizados correctamente."
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <div className="categorias-trabajador">
        <p>Cargando oficios...</p>
      </div>
    );
  }

  return (
    <div className="categorias-trabajador">

      <div className="categorias-trabajador__titulo">
        <Wrench size={19} />

        <div>
          <h3>Oficios y servicios</h3>

          <p>
            Seleccioná los trabajos que podés realizar.
          </p>
        </div>
      </div>

      {error && (
        <div className="categorias-trabajador__error">
          {error}
        </div>
      )}

      {exito && (
        <div className="categorias-trabajador__exito">
          <CheckCircle2 size={17} />
          {exito}
        </div>
      )}

      <div className="categorias-trabajador__lista">

        {categorias.map((categoria) => {
          const seleccionada =
            seleccionadas.includes(categoria.id);

          return (
            <button
              type="button"
              key={categoria.id}
              className={
                seleccionada
                  ? "categorias-trabajador__item categorias-trabajador__item--seleccionado"
                  : "categorias-trabajador__item"
              }
              onClick={() =>
                alternarCategoria(categoria.id)
              }
            >
              <span className="categorias-trabajador__check">
                {seleccionada && "✓"}
              </span>

              <div>
                <strong>{categoria.nombre}</strong>

                {categoria.descripcion && (
                  <small>
                    {categoria.descripcion}
                  </small>
                )}
              </div>
            </button>
          );
        })}

      </div>

      <div className="categorias-trabajador__acciones">
        <button
          type="button"
          className="categorias-trabajador__guardar"
          onClick={guardarCategorias}
          disabled={guardando}
        >
          <Save size={17} />

          {guardando
            ? "Guardando..."
            : "Guardar oficios"}
        </button>
      </div>

    </div>
  );
}

export default CategoriasTrabajador;