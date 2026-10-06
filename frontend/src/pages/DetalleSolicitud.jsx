import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Star,
  Clock3,
  BadgeCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import {
  obtenerDetalleSolicitud,
  aceptarPropuesta,
} from "../services/solicitudesService.js";

import "./DetalleSolicitud.css";

function DetalleSolicitud() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitud, setSolicitud] = useState(null);
  const [propuestas, setPropuestas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [aceptandoId, setAceptandoId] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");

  async function cargarSolicitud() {
    try {
      const datos = await obtenerDetalleSolicitud(id);

      setSolicitud(datos.solicitud);
      setPropuestas(datos.propuestas || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarSolicitud();
  }, [id]);

  async function handleAceptar(propuestaId) {
    const confirmar = window.confirm(
      "¿Querés aceptar esta propuesta? Las demás propuestas pendientes serán rechazadas."
    );

    if (!confirmar) {
      return;
    }

    setError("");
    setMensajeExito("");
    setAceptandoId(propuestaId);

    try {
      const datos = await aceptarPropuesta(
        id,
        propuestaId
      );

      setMensajeExito(datos.message);

      await cargarSolicitud();
    } catch (error) {
      setError(error.message);
    } finally {
      setAceptandoId(null);
    }
  }

  function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString(
      "es-AR"
    );
  }

  if (cargando) {
    return (
      <>
        <Header />
        <main className="detalle-solicitud detalle-solicitud--estado">
          Cargando solicitud...
        </main>
        <Footer />
      </>
    );
  }

  if (!solicitud) {
    return (
      <>
        <Header />
        <main className="detalle-solicitud detalle-solicitud--estado">
          {error || "Solicitud no encontrada"}
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="detalle-solicitud">
        <div className="detalle-solicitud__contenido">

          <button
            type="button"
            className="detalle-solicitud__volver"
            onClick={() => navigate("/solicitudes")}
          >
            <ArrowLeft size={18} />
            Volver a mis solicitudes
          </button>

          <section className="detalle-solicitud__cabecera">

            <div>
              <span className="detalle-solicitud__categoria">
                {solicitud.categoria?.nombre}
              </span>

              <h1>{solicitud.titulo}</h1>

              <p>{solicitud.descripcion}</p>

              <div className="detalle-solicitud__info">
                {solicitud.zona && (
                  <span>
                    <MapPin size={16} />
                    {solicitud.zona}
                  </span>
                )}

                <span>
                  <CalendarDays size={16} />
                  {formatearFecha(
                    solicitud.fechaCreacion
                  )}
                </span>
              </div>
            </div>

            <span className="detalle-solicitud__estado">
              {solicitud.estado}
            </span>

          </section>

          {mensajeExito && (
            <div className="detalle-solicitud__exito">
              <CheckCircle2 size={18} />
              {mensajeExito}
            </div>
          )}

          {error && (
            <div className="detalle-solicitud__error">
              {error}
            </div>
          )}

          <section className="detalle-solicitud__propuestas">

            <div className="detalle-solicitud__titulo">
              <h2>Propuestas recibidas</h2>
              <span>{propuestas.length}</span>
            </div>

            {propuestas.length === 0 ? (
              <div className="detalle-solicitud__vacio">
                Todavía no recibiste propuestas para esta solicitud.
              </div>
            ) : (
              <div className="detalle-solicitud__lista">

                {propuestas.map((propuesta) => {
                  const trabajador =
                    propuesta.perfilTrabajador;

                  const usuario =
                    trabajador.usuario;

                  const iniciales =
                    `${usuario.nombre?.charAt(0) || ""}${usuario.apellido?.charAt(0) || ""}`
                      .toUpperCase();

                  return (
                    <article
                      key={propuesta.id}
                      className="propuesta-card"
                    >

                      <div className="propuesta-card__trabajador">

                        <div className="propuesta-card__avatar">
                          {usuario.fotoPerfilUrl ? (
                            <img
                              src={
                                usuario.fotoPerfilUrl
                              }
                              alt={`Foto de ${usuario.nombre}`}
                            />
                          ) : (
                            iniciales
                          )}
                        </div>

                        <div>
                          <div className="propuesta-card__nombre">
                            <strong>
                              {usuario.nombre}{" "}
                              {usuario.apellido}
                            </strong>

                            {usuario.estaVerificado && (
                              <BadgeCheck size={17} />
                            )}
                          </div>

                          <span>
                            {trabajador.tituloProfesional ||
                              "Trabajador de Al Rescate"}
                          </span>
                        </div>

                      </div>

                      <div className="propuesta-card__resumen">

                        <div>
                          <small>Propuesta</small>
                          <strong>
                            ${Number(
                              propuesta.monto
                            ).toLocaleString("es-AR")}
                          </strong>
                        </div>

                        <div>
                          <small>Tiempo estimado</small>

                          <strong>
                            <Clock3 size={15} />

                            {propuesta.diasEstimados
                              ? `${propuesta.diasEstimados} días`
                              : "A coordinar"}
                          </strong>
                        </div>

                        <div>
                          <small>Calificación</small>

                          <strong>
                            <Star size={15} />
                            {Number(
                              trabajador.calificacion ||
                                0
                            ).toFixed(1)}
                          </strong>
                        </div>

                      </div>

                      {propuesta.mensaje && (
                        <p className="propuesta-card__mensaje">
                          {propuesta.mensaje}
                        </p>
                      )}

                      <div className="propuesta-card__acciones">

                        <Link
                          to={`/trabajadores/${usuario.id}`}
                          className="propuesta-card__perfil"
                        >
                          Ver perfil
                          <ArrowRight size={16} />
                        </Link>

                        {solicitud.estado ===
                          "PUBLICADA" &&
                          propuesta.estado ===
                            "PENDIENTE" && (
                            <button
                              type="button"
                              className="propuesta-card__aceptar"
                              onClick={() =>
                                handleAceptar(
                                  propuesta.id
                                )
                              }
                              disabled={
                                aceptandoId ===
                                propuesta.id
                              }
                            >
                              {aceptandoId ===
                              propuesta.id
                                ? "Aceptando..."
                                : "Aceptar propuesta"}
                            </button>
                          )}

                        <span className="propuesta-card__estado">
                          {propuesta.estado}
                        </span>

                      </div>

                    </article>
                  );
                })}

              </div>
            )}

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default DetalleSolicitud;