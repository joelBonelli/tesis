import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  MapPin,
  Clock3,
  Star,
  CheckCircle2,
  Store,
} from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import {
  obtenerTrabajadorPorId,
  obtenerCalificacionesTrabajador,
} from "../services/trabajadoresService.js";

import "./TrabajadorPublico.css";

function TrabajadorPublico() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [calificaciones, setCalificaciones] = useState([]);
  const [cantidadCalificaciones, setCantidadCalificaciones] =
    useState(0);

  useEffect(() => {
    async function cargarTrabajador() {
      try {
          const [
              datosPerfil,
              datosCalificaciones,
          ] = await Promise.all([
              obtenerTrabajadorPorId(id),
              obtenerCalificacionesTrabajador(id),
          ]);

          setPerfil(datosPerfil);

          setCalificaciones(
              datosCalificaciones.calificaciones || []
          );

          setCantidadCalificaciones(
              datosCalificaciones.cantidadCalificaciones || 0
          );
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarTrabajador();
  }, [id]);

  if (cargando) {
    return (
      <>
        <Header />

        <main className="trabajador-publico trabajador-publico--estado">
          <p>Cargando perfil...</p>
        </main>

        <Footer />
      </>
    );
  }

  if (error || !perfil) {
    return (
      <>
        <Header />

        <main className="trabajador-publico trabajador-publico--estado">
          <p>
            {error || "No se encontró el trabajador."}
          </p>
        </main>

        <Footer />
      </>
    );
  }

  const iniciales =
    `${perfil.usuario.nombre?.charAt(0) || ""}${perfil.usuario.apellido?.charAt(0) || ""}`
      .toUpperCase();

  const calificacion = Number(
    perfil.calificacion || 0
  );

  return (
    <>
      <Header />

      <main className="trabajador-publico">
        <div className="trabajador-publico__contenido">

          <button
            type="button"
            className="trabajador-publico__volver"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Volver
          </button>

          <section className="trabajador-publico__cabecera">

            <div className="trabajador-publico__avatar">
              {perfil.usuario.fotoPerfilUrl ? (
                <img
                  src={perfil.usuario.fotoPerfilUrl}
                  alt={`Foto de ${perfil.usuario.nombre}`}
                />
              ) : (
                iniciales
              )}
            </div>

            <div className="trabajador-publico__identidad">

              <div className="trabajador-publico__nombre">
                <h1>
                  {perfil.usuario.nombre}{" "}
                  {perfil.usuario.apellido}
                </h1>

                {perfil.usuario.estaVerificado && (
                  <BadgeCheck size={22} />
                )}
              </div>

              <h2>
                {perfil.tituloProfesional ||
                  "Trabajador de Al Rescate"}
              </h2>

              <div className="trabajador-publico__resumen">

                <span>
                  <Star size={17} />
                  {calificacion.toFixed(1)}
                </span>

                <span>
                  <BriefcaseBusiness size={17} />
                  {perfil.trabajosRealizados} trabajos
                </span>

                <span
                  className={
                    perfil.disponible
                      ? "trabajador-publico__disponible"
                      : "trabajador-publico__no-disponible"
                  }
                >
                  <CheckCircle2 size={17} />

                  {perfil.disponible
                    ? "Disponible"
                    : "No disponible"}
                </span>

              </div>
            </div>

          </section>

        <div className="trabajador-publico__grid">

            <section className="trabajador-publico__seccion trabajador-publico__seccion--principal">

                <h3>Sobre mí</h3>

                <p>
                    {perfil.descripcion ||
                        "Este trabajador todavía no agregó una presentación."}
                </p>

                <div className="trabajador-publico__informacion">

                    <div>
                        <MapPin size={19} />

                        <span>
                            <small>Zona de trabajo</small>

                            <strong>
                                {perfil.zonaTrabajo ||
                                    "No informada"}
                            </strong>
                        </span>
                    </div>

                    <div>
                        <Clock3 size={19} />

                        <span>
                            <small>Experiencia</small>

                            <strong>
                                {perfil.aniosExperiencia !== null
                                    ? `${perfil.aniosExperiencia} años`
                                    : "No informada"}
                            </strong>
                        </span>
                    </div>

                </div>

              <div className="trabajador-publico__oficios">
                <h3>Oficios y servicios</h3>

                <div className="trabajador-publico__chips">

                  {perfil.categorias.length > 0 ? (
                    perfil.categorias.map((item) => (
                      <span key={item.categoria.id}>
                        {item.categoria.nombre}
                      </span>
                    ))
                  ) : (
                    <p>
                      Todavía no informó sus oficios.
                    </p>
                  )}

                </div>
              </div>

            </section>

            <aside className="trabajador-publico__seccion">

              <div className="trabajador-publico__sponsors-titulo">
                <Store size={20} />

                <div>
                  <h3>Respaldado por</h3>
                  <p>
                    Comercios u organizaciones que avalan
                    a este trabajador.
                  </p>
                </div>
              </div>

              <div className="trabajador-publico__sponsors">

                {perfil.patrocinios.length > 0 ? (
                  perfil.patrocinios.map(
                    (patrocinio) => (
                      <div
                        key={patrocinio.id}
                        className="trabajador-publico__sponsor"
                      >
                        {patrocinio.sponsor.logoUrl ? (
                          <img
                            src={
                              patrocinio.sponsor.logoUrl
                            }
                            alt={
                              patrocinio.sponsor
                                .nombreFantasia
                            }
                          />
                        ) : (
                          <div className="trabajador-publico__sponsor-logo">
                            <Store size={20} />
                          </div>
                        )}

                        <div>
                          <strong>
                            {
                              patrocinio.sponsor
                                .nombreFantasia
                            }
                          </strong>

                          {patrocinio.sponsor
                            .estaVerificado && (
                            <small>
                              Sponsor verificado
                            </small>
                          )}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p className="trabajador-publico__sin-sponsors">
                    Este trabajador todavía no posee
                    patrocinios aprobados.
                  </p>
                )}

              </div>
                <section className="trabajador-publico__seccion trabajador-publico__calificaciones">

                    <div className="trabajador-publico__calificaciones-cabecera">
                        <div>
                            <h3>Calificaciones</h3>

                            <p>
                                Opiniones de clientes que contrataron a este trabajador.
                            </p>
                        </div>

                        <div className="trabajador-publico__calificacion-resumen">
                            <Star size={20} />

                            <strong>
                                {calificacion.toFixed(1)}
                            </strong>

                            <span>
                                {cantidadCalificaciones === 1
                                    ? "1 opinión"
                                    : `${cantidadCalificaciones} opiniones`}
                            </span>
                        </div>
                    </div>

                    {calificaciones.length > 0 ? (
                        <div className="trabajador-publico__opiniones">

                            {calificaciones.map((item) => (
                                <article
                                    key={item.id}
                                    className="trabajador-publico__opinion"
                                >

                                    <div className="trabajador-publico__estrellas">
                                        {[1, 2, 3, 4, 5].map((estrella) => (
                                            <Star
                                                key={estrella}
                                                size={16}
                                                fill={
                                                    estrella <= item.puntuacion
                                                        ? "currentColor"
                                                        : "none"
                                                }
                                            />
                                        ))}
                                    </div>

                                    <p>
                                        {item.comentario ||
                                            "El cliente no dejó un comentario."}
                                    </p>

                                    <div className="trabajador-publico__opinion-info">

                                        <strong>
                                            {item.cliente.nombre}{" "}
                                            {item.cliente.apellido?.charAt(0)}.
                                        </strong>

                                        <span>
                                            {item.servicio.categoria}
                                        </span>

                                    </div>

                                </article>
                            ))}

                        </div>
                    ) : (
                        <p className="trabajador-publico__sin-opiniones">
                            Este trabajador todavía no recibió calificaciones.
                        </p>
                    )}

                </section>

            </aside>
            
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default TrabajadorPublico;