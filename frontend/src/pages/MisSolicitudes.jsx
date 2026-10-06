import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  ClipboardList,
  MapPin,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import { obtenerMisSolicitudes } from "../services/solicitudesService.js";

import "./MisSolicitudes.css";

function MisSolicitudes() {
  const navigate = useNavigate();

  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarSolicitudes() {
      try {
        const datos = await obtenerMisSolicitudes();

        setSolicitudes(datos.solicitudes || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarSolicitudes();
  }, []);

  function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString(
      "es-AR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  }

  function obtenerTextoEstado(estado) {
    const estados = {
      PUBLICADA: "Publicada",
      EN_PROCESO: "En proceso",
      FINALIZADA: "Finalizada",
      CANCELADA: "Cancelada",
    };

    return estados[estado] || estado;
  }

  return (
    <>
      <Header />

      <main className="mis-solicitudes">
        <div className="mis-solicitudes__contenido">

          <button
            type="button"
            className="mis-solicitudes__volver"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={18} />
            Volver a mi cuenta
          </button>

          <div className="mis-solicitudes__cabecera">

            <div>
              <span>Servicios</span>

              <h1>Mis solicitudes</h1>

              <p>
                Revisá los servicios que publicaste y
                las propuestas que recibiste.
              </p>
            </div>

            <button
              type="button"
              className="mis-solicitudes__nueva"
              onClick={() => navigate("/solicitudes/nueva")}
            >
              Nueva solicitud
            </button>

          </div>

          {cargando && (
            <div className="mis-solicitudes__estado">
              Cargando solicitudes...
            </div>
          )}

          {error && (
            <div className="mis-solicitudes__error">
              {error}
            </div>
          )}

          {!cargando &&
            !error &&
            solicitudes.length === 0 && (
              <div className="mis-solicitudes__vacio">
                <ClipboardList size={38} />

                <h2>
                  Todavía no publicaste solicitudes
                </h2>

                <p>
                  Cuando necesites un servicio,
                  vas a poder publicarlo desde acá.
                </p>
              </div>
            )}

          {!cargando &&
            !error &&
            solicitudes.length > 0 && (
              <div className="mis-solicitudes__lista">

                {solicitudes.map((solicitud) => (
                  <article
                    key={solicitud.id}
                    className="solicitud-card"
                  >

                    <div className="solicitud-card__superior">

                      <span className="solicitud-card__categoria">
                        {solicitud.categoria.nombre}
                      </span>

                      <span
                        className={`solicitud-card__estado solicitud-card__estado--${solicitud.estado.toLowerCase()}`}
                      >
                        {obtenerTextoEstado(
                          solicitud.estado
                        )}
                      </span>

                    </div>

                    <h2>{solicitud.titulo}</h2>

                    <p className="solicitud-card__descripcion">
                      {solicitud.descripcion}
                    </p>

                    <div className="solicitud-card__info">

                      {solicitud.zona && (
                        <span>
                          <MapPin size={15} />
                          {solicitud.zona}
                        </span>
                      )}

                      <span>
                        <CalendarDays size={15} />
                        {formatearFecha(
                          solicitud.fechaCreacion
                        )}
                      </span>

                    </div>

                    <Link
                      to={`/solicitudes/${solicitud.id}`}
                      className="solicitud-card__ver"
                    >
                      Ver solicitud
                      <ArrowRight size={17} />
                    </Link>

                  </article>
                ))}

              </div>
            )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default MisSolicitudes;