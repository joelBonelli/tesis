import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    BriefcaseBusiness,
    MapPin,
    CalendarDays,
    BadgeCheck,
    Send,
    X,
    CheckCircle2,
} from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import {
    obtenerSolicitudesCompatibles,
    crearPropuesta,
    obtenerMisPropuestas,
} from "../services/solicitudesService.js";

import "./Trabajo.css";

function Trabajo() {
    const navigate = useNavigate();

    const [solicitudes, setSolicitudes] = useState([]);
    const [propuestas, setPropuestas] = useState([]);
    const [vista, setVista] = useState("oportunidades");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [exito, setExito] = useState("");

    const [solicitudSeleccionada, setSolicitudSeleccionada] =
        useState(null);

    const [enviando, setEnviando] = useState(false);

    const [formulario, setFormulario] = useState({
        monto: "",
        diasEstimados: "",
        mensaje: "",
    });

    useEffect(() => {
        async function cargarSolicitudes() {
            try {
                const [
                    datosSolicitudes,
                    datosPropuestas,
                ] = await Promise.all([
                    obtenerSolicitudesCompatibles(),
                    obtenerMisPropuestas(),
                ]);

                setSolicitudes(
                    datosSolicitudes.solicitudes || []
                );

                setPropuestas(
                    datosPropuestas.propuestas || []
                );
            } catch (error) {
                setError(error.message);
            } finally {
                setCargando(false);
            }
        }

        cargarSolicitudes();
    }, []);

    function abrirPropuesta(solicitud) {
        setError("");
        setExito("");

        setSolicitudSeleccionada(solicitud);

        setFormulario({
            monto: "",
            diasEstimados: "",
            mensaje: "",
        });
    }

    function cerrarPropuesta() {
        setSolicitudSeleccionada(null);
        setError("");
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value,
        }));
    }

    async function handleEnviar(event) {
        event.preventDefault();

        setError("");
        setExito("");

        if (
            !formulario.monto ||
            Number(formulario.monto) <= 0
        ) {
            setError("Ingresá un monto válido");
            return;
        }

        setEnviando(true);

        try {
            await crearPropuesta(
                solicitudSeleccionada.id,
                {
                    monto: Number(formulario.monto),

                    diasEstimados:
                        formulario.diasEstimados === ""
                            ? undefined
                            : Number(formulario.diasEstimados),

                    mensaje:
                        formulario.mensaje.trim() || undefined,
                }
            );

            setSolicitudes((anteriores) =>
                anteriores.filter(
                    (solicitud) =>
                        solicitud.id !==
                        solicitudSeleccionada.id
                )
            );

            setSolicitudSeleccionada(null);

            setExito(
                "Tu propuesta fue enviada correctamente."
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setEnviando(false);
        }
    }

    function formatearFecha(fecha) {
        return new Date(fecha).toLocaleDateString(
            "es-AR"
        );
    }

    return (
        <>
            <Header />

            <main className="trabajo">
                <div className="trabajo__contenido">

                    <button
                        type="button"
                        className="trabajo__volver"
                        onClick={() => navigate("/dashboard")}
                    >
                        <ArrowLeft size={18} />
                        Volver a mi cuenta
                    </button>

                    <div className="trabajo__cabecera">

                        <div>
                            <span>Trabajador</span>

                            <h1>Oportunidades disponibles</h1>

                            <p>
                                Solicitudes que coinciden con los
                                oficios de tu perfil profesional.
                            </p>
                        </div>

                    </div>

                    <div className="trabajo__tabs">

                        <button
                            type="button"
                            className={
                            vista === "oportunidades"
                                ? "trabajo__tab trabajo__tab--activo"
                                : "trabajo__tab"
                            }
                            onClick={() => setVista("oportunidades")}
                        >
                            Oportunidades
                        </button>

                        <button
                            type="button"
                            className={
                            vista === "propuestas"
                                ? "trabajo__tab trabajo__tab--activo"
                                : "trabajo__tab"
                            }
                            onClick={() => setVista("propuestas")}
                        >
                            Mis propuestas

                            {propuestas.length > 0 && (
                            <span>{propuestas.length}</span>
                            )}
                        </button>

                    </div>

                    {exito && (
                        <div className="trabajo__exito">
                            <CheckCircle2 size={18} />
                            {exito}
                        </div>
                    )}

                    {error && !solicitudSeleccionada && (
                        <div className="trabajo__error">
                            {error}
                        </div>
                    )}

                    {cargando && (
                        <div className="trabajo__estado">
                            Buscando oportunidades...
                        </div>
                    )}

                    {!cargando &&
                        vista === "oportunidades" &&
                        solicitudes.length === 0 && (
                            <div className="trabajo__vacio">
                                <BriefcaseBusiness size={40} />

                                <h2>
                                    No hay solicitudes disponibles
                                </h2>

                                <p>
                                    Cuando aparezcan solicitudes compatibles
                                    con tus oficios, las vas a ver acá.
                                </p>
                            </div>
                        )}

                    {!cargando &&
                        vista === "oportunidades" &&    
                        solicitudes.length > 0 && (
                            <div className="trabajo__lista">

                                {solicitudes.map((solicitud) => (
                                    <article
                                        key={solicitud.id}
                                        className="trabajo-card"
                                    >

                                        <div className="trabajo-card__superior">

                                            <span className="trabajo-card__categoria">
                                                {solicitud.categoria.nombre}
                                            </span>

                                            <span className="trabajo-card__fecha">
                                                <CalendarDays size={14} />

                                                {formatearFecha(
                                                    solicitud.fechaCreacion
                                                )}
                                            </span>

                                        </div>

                                        <h2>{solicitud.titulo}</h2>

                                        <p>
                                            {solicitud.descripcion}
                                        </p>

                                        <div className="trabajo-card__datos">

                                            {solicitud.zona && (
                                                <span>
                                                    <MapPin size={15} />
                                                    {solicitud.zona}
                                                </span>
                                            )}

                                            <span>
                                                {solicitud.cliente.nombre}{" "}
                                                {solicitud.cliente.apellido}

                                                {solicitud.cliente
                                                    .estaVerificado && (
                                                        <BadgeCheck size={15} />
                                                    )}
                                            </span>

                                        </div>

                                        <button
                                            type="button"
                                            className="trabajo-card__proponer"
                                            onClick={() =>
                                                abrirPropuesta(solicitud)
                                            }
                                        >
                                            Enviar propuesta
                                        </button>

                                    </article>
                                ))}

                            </div>
                        )}

                    {!cargando &&
                        vista === "propuestas" &&
                        propuestas.length === 0 && (
                            <div className="trabajo__vacio">
                            <BriefcaseBusiness size={40} />

                            <h2>Todavía no enviaste propuestas</h2>

                            <p>
                                Cuando te postules a un trabajo,
                                vas a poder seguir su estado desde acá.
                            </p>
                            </div>
                        )}

                        {!cargando &&
                        vista === "propuestas" &&
                        propuestas.length > 0 && (
                            <div className="trabajo__propuestas-lista">

                            {propuestas.map((propuesta) => (
                                <article
                                key={propuesta.id}
                                className="trabajo-propuesta-card"
                                >

                                <div className="trabajo-propuesta-card__superior">

                                    <div>
                                    <span className="trabajo-propuesta-card__categoria">
                                        {propuesta.solicitud.categoria.nombre}
                                    </span>

                                    <h2>
                                        {propuesta.solicitud.titulo}
                                    </h2>
                                    </div>

                                    <span
                                    className={`trabajo-propuesta-card__estado trabajo-propuesta-card__estado--${propuesta.estado.toLowerCase()}`}
                                    >
                                    {propuesta.estado}
                                    </span>

                                </div>

                                <p>
                                    {propuesta.solicitud.descripcion}
                                </p>

                                <div className="trabajo-propuesta-card__datos">

                                    <div>
                                    <small>Tu propuesta</small>

                                    <strong>
                                        ${Number(
                                        propuesta.monto
                                        ).toLocaleString("es-AR")}
                                    </strong>
                                    </div>

                                    <div>
                                    <small>Tiempo estimado</small>

                                    <strong>
                                        {propuesta.diasEstimados
                                        ? `${propuesta.diasEstimados} días`
                                        : "A coordinar"}
                                    </strong>
                                    </div>

                                    <div>
                                    <small>Cliente</small>

                                    <strong>
                                        {propuesta.solicitud.cliente.nombre}{" "}
                                        {propuesta.solicitud.cliente.apellido}
                                    </strong>
                                    </div>

                                </div>

                                {propuesta.mensaje && (
                                    <div className="trabajo-propuesta-card__mensaje">
                                    <small>Tu mensaje</small>

                                    <p>{propuesta.mensaje}</p>
                                    </div>
                                )}

                                </article>
                            ))}

                            </div>
                        )}

                    {solicitudSeleccionada && (
                        <section className="trabajo__propuesta">

                            <div className="trabajo__propuesta-cabecera">

                                <div>
                                    <span>Enviar propuesta</span>

                                    <h2>
                                        {solicitudSeleccionada.titulo}
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={cerrarPropuesta}
                                    disabled={enviando}
                                >
                                    <X size={20} />
                                </button>

                            </div>

                            <form onSubmit={handleEnviar}>

                                <label>
                                    Precio propuesto

                                    <input
                                        type="number"
                                        min="1"
                                        name="monto"
                                        value={formulario.monto}
                                        onChange={handleChange}
                                        placeholder="Ej: 45000"
                                        required
                                    />
                                </label>

                                <label>
                                    Días estimados

                                    <input
                                        type="number"
                                        min="1"
                                        name="diasEstimados"
                                        value={formulario.diasEstimados}
                                        onChange={handleChange}
                                        placeholder="Ej: 2"
                                    />
                                </label>

                                <label className="trabajo__mensaje">
                                    Mensaje para el cliente

                                    <textarea
                                        name="mensaje"
                                        value={formulario.mensaje}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Contale brevemente cómo realizarías el trabajo..."
                                    />
                                </label>

                                {error && (
                                    <div className="trabajo__error">
                                        {error}
                                    </div>
                                )}

                                <div className="trabajo__acciones">

                                    <button
                                        type="button"
                                        className="trabajo__cancelar"
                                        onClick={cerrarPropuesta}
                                        disabled={enviando}
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="trabajo__enviar"
                                        disabled={enviando}
                                    >
                                        <Send size={17} />

                                        {enviando
                                            ? "Enviando..."
                                            : "Enviar propuesta"}
                                    </button>

                                </div>

                            </form>

                        </section>
                    )}

                </div>
            </main>

            <Footer />
        </>
    );
}

export default Trabajo;