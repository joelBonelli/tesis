import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ClipboardList,
  MapPin,
  Send,
} from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import { crearSolicitud } from "../services/solicitudesService.js";
import { obtenerCategoriasActivas } from "../services/trabajadoresService.js";

import "./NuevaSolicitud.css";

function NuevaSolicitud() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);

  const [formulario, setFormulario] = useState({
    categoriaId: "",
    titulo: "",
    descripcion: "",
    zona: "",
  });

  const [cargandoCategorias, setCargandoCategorias] =
    useState(true);

  const [publicando, setPublicando] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarCategorias() {
      try {
        const datos = await obtenerCategoriasActivas();

        setCategorias(datos.categorias || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargandoCategorias(false);
      }
    }

    cargarCategorias();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!formulario.categoriaId) {
      setError("Seleccioná una categoría");
      return;
    }

    if (!formulario.titulo.trim()) {
      setError("Ingresá un título");
      return;
    }

    if (!formulario.descripcion.trim()) {
      setError("Ingresá una descripción");
      return;
    }

    setPublicando(true);

    try {
      const datos = await crearSolicitud({
        categoriaId: Number(formulario.categoriaId),
        titulo: formulario.titulo.trim(),
        descripcion: formulario.descripcion.trim(),
        zona: formulario.zona.trim(),
      });

      navigate(
        `/solicitudes/${datos.solicitud.id}`
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setPublicando(false);
    }
  }

  return (
    <>
      <Header />

      <main className="nueva-solicitud">
        <div className="nueva-solicitud__contenido">

          <button
            type="button"
            className="nueva-solicitud__volver"
            onClick={() => navigate("/solicitudes")}
          >
            <ArrowLeft size={18} />
            Volver a mis solicitudes
          </button>

          <section className="nueva-solicitud__panel">

            <div className="nueva-solicitud__cabecera">
              <div className="nueva-solicitud__icono">
                <ClipboardList size={27} />
              </div>

              <div>
                <span>Nueva solicitud</span>

                <h1>¿Qué necesitás resolver?</h1>

                <p>
                  Contanos qué trabajo necesitás y los
                  trabajadores compatibles podrán enviarte
                  propuestas.
                </p>
              </div>
            </div>

            <form
              className="nueva-solicitud__formulario"
              onSubmit={handleSubmit}
            >

              <label>
                Tipo de servicio

                <select
                  name="categoriaId"
                  value={formulario.categoriaId}
                  onChange={handleChange}
                  disabled={cargandoCategorias}
                  required
                >
                  <option value="">
                    {cargandoCategorias
                      ? "Cargando categorías..."
                      : "Seleccioná una categoría"}
                  </option>

                  {categorias.map((categoria) => (
                    <option
                      key={categoria.id}
                      value={categoria.id}
                    >
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Título

                <input
                  type="text"
                  name="titulo"
                  value={formulario.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Necesito reparar una pérdida de agua"
                  maxLength="150"
                  required
                />
              </label>

              <label className="nueva-solicitud__completo">
                Descripción

                <textarea
                  name="descripcion"
                  value={formulario.descripcion}
                  onChange={handleChange}
                  placeholder="Describí el problema o trabajo con el mayor detalle posible..."
                  rows="6"
                  required
                />
              </label>

              <label className="nueva-solicitud__completo">
                Zona

                <div className="nueva-solicitud__campo-icono">
                  <MapPin size={18} />

                  <input
                    type="text"
                    name="zona"
                    value={formulario.zona}
                    onChange={handleChange}
                    placeholder="Ej: Boedo, CABA"
                  />
                </div>
              </label>

              {error && (
                <div className="nueva-solicitud__error">
                  {error}
                </div>
              )}

              <div className="nueva-solicitud__acciones">

                <button
                  type="button"
                  className="nueva-solicitud__cancelar"
                  onClick={() =>
                    navigate("/solicitudes")
                  }
                  disabled={publicando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="nueva-solicitud__publicar"
                  disabled={publicando}
                >
                  <Send size={17} />

                  {publicando
                    ? "Publicando..."
                    : "Publicar solicitud"}
                </button>

              </div>

            </form>

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default NuevaSolicitud;