import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    Handshake,
    MapPin,
    CalendarDays,
    UserRound,
    BriefcaseBusiness,
} from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import { obtenerMisContrataciones } from "../services/contratacionesService.js";

import "./Contrataciones.css";

function Contrataciones() {
    const navigate = useNavigate();

    const usuarioGuardado = JSON.parse(
        localStorage.getItem("usuario") || "null"
    );

    const usuarioId = usuarioGuardado?.id;

    const [contrataciones, setContrataciones] = useState([]);
    const [vista, setVista] = useState("cliente");

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarContrataciones() {
            try {
                const datos = await obtenerMisContrataciones();

                setContrataciones(
                    datos.contrataciones || []
                );
            } catch (error) {
                setError(error.message);
            } finally {
                setCargando(false);
            }
        }

        cargarContrataciones();
    }, []);

    const comoCliente = contrataciones.filter(
        (contratacion) =>
            contratacion.solicitud.cliente.id === usuarioId
    );

    const comoTrabajador = contrataciones.filter(
        (contratacion) =>
            contratacion.propuesta.perfilTrabajador.usuario.id ===
            usuarioId
    );

    const contratacionesVisibles =
        vista === "cliente"
            ? comoCliente
            : comoTrabajador;

    function formatearFecha(fecha) {
        if (!fecha) {
            return "No informada";
        }

        return new Date(fecha).toLocaleDateString(
            "es-AR"
        );
    }

    function textoEstado(estado) {
        const estados = {
            EN_PROCESO: "En proceso",
            FINALIZADA: "Finalizada",
            CANCELADA: "Cancelada",
        };

        return estados[estado] || estado;
    }

    return (
        <>
            <Header />

            <main className="contrataciones">
                <div className="contrataciones__contenido">

                    <button
                        type="button"
                        className="contrataciones__volver"
                        onClick={() => navigate("/dashboard")}
                    >
                        <ArrowLeft size={18} />
                        Volver a mi cuenta
                    </button>

                    <div className="contrataciones__cabecera">

                        <span>Servicios contratados</span>

                        <h1>Mis contrataciones</h1>

                        <p>
                            Seguí los trabajos que contrataste o
                            que estás realizando como trabajador.
                        </p>

                    </div>

                    <div className="contrataciones__tabs">

                        <button
                            type="button"
                            className={
                                vista === "cliente"
                                    ? "contrataciones__tab contrataciones__tab--activo"
                                    : "contrataciones__tab"
                            }
                            onClick={() => setVista("cliente")}
                        >
                            Como cliente

                            <span>{comoCliente.length}</span>
                        </button>

                        <button
                            type="button"
                            className={
                                vista === "trabajador"
                                    ? "contrataciones__tab contrataciones__tab--activo"
                                    : "contrataciones__tab"
                            }
                            onClick={() => setVista("trabajador")}
                        >
                            Como trabajador

                            <span>{comoTrabajador.length}</span>
                        </button>

                    </div>

                    {cargando && (
                        <div className="contrataciones__estado">
                            Cargando contrataciones...
                        </div>
                    )}

                    {error && (
                        <div className="contrataciones__error">
                            {error}
                        </div>
                    )}

                    {!cargando &&
                        !error &&
                        contratacionesVisibles.length === 0 && (
                            <div className="contrataciones__vacio">

                                <Handshake size={42} />

                                <h2>
                                    No tenés contrataciones en esta sección
                                </h2>

                                <p>
                                    Cuando una propuesta sea aceptada,
                                    el trabajo aparecerá acá.
                                </p>

                            </div>
                        )}

                    {!cargando &&
                        !error &&
                        contratacionesVisibles.length > 0 && (
                            <div className="contrataciones__lista">

                                {contratacionesVisibles.map(
                                    (contratacion) => {
                                        const esCliente =
                                            contratacion.solicitud.cliente.id ===
                                            usuarioId;

                                        const otraPersona = esCliente
                                            ? contratacion.propuesta
                                                .perfilTrabajador.usuario
                                            : contratacion.solicitud.cliente;

                                        return (
                                            <article
                                                key={contratacion.id}
                                                className="contratacion-card"
                                            >

                                                <div className="contratacion-card__superior">

                                                    <span className="contratacion-card__categoria">
                                                        {
                                                            contratacion.solicitud
                                                                .categoria.nombre
                                                        }
                                                    </span>

                                                    <span
                                                        className={`contratacion-card__estado contratacion-card__estado--${contratacion.estado.toLowerCase()}`}
                                                    >
                                                        {textoEstado(
                                                            contratacion.estado
                                                        )}
                                                    </span>

                                                </div>

                                                <h2>
                                                    {
                                                        contratacion.solicitud
                                                            .titulo
                                                    }
                                                </h2>

                                                <p className="contratacion-card__descripcion">
                                                    {
                                                        contratacion.solicitud
                                                            .descripcion
                                                    }
                                                </p>

                                                <div className="contratacion-card__datos">

                                                    <div>
                                                        <UserRound size={16} />

                                                        <span>
                                                            <small>
                                                                {esCliente
                                                                    ? "Trabajador"
                                                                    : "Cliente"}
                                                            </small>

                                                            <strong>
                                                                {otraPersona.nombre}{" "}
                                                                {otraPersona.apellido}
                                                            </strong>
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <BriefcaseBusiness
                                                            size={16}
                                                        />

                                                        <span>
                                                            <small>
                                                                Monto acordado
                                                            </small>

                                                            <strong>
                                                                $
                                                                {Number(
                                                                    contratacion.montoAcordado
                                                                ).toLocaleString(
                                                                    "es-AR"
                                                                )}
                                                            </strong>
                                                        </span>
                                                    </div>

                                                    {contratacion.solicitud
                                                        .zona && (
                                                            <div>
                                                                <MapPin size={16} />

                                                                <span>
                                                                    <small>Zona</small>

                                                                    <strong>
                                                                        {
                                                                            contratacion
                                                                                .solicitud.zona
                                                                        }
                                                                    </strong>
                                                                </span>
                                                            </div>
                                                        )}

                                                    <div>
                                                        <CalendarDays size={16} />

                                                        <span>
                                                            <small>
                                                                Contratado
                                                            </small>

                                                            <strong>
                                                                {formatearFecha(
                                                                    contratacion.fechaContratacion
                                                                )}
                                                            </strong>
                                                        </span>
                                                    </div>

                                                </div>

                                                <button
                                                    type="button"
                                                    className="contratacion-card__abrir"
                                                    onClick={() =>
                                                        navigate(
                                                            `/contrataciones/${contratacion.id}`
                                                        )
                                                    }
                                                >
                                                    Ver trabajo
                                                </button>

                                            </article>
                                        );
                                    }
                                )}

                            </div>
                        )}

                </div>
            </main>

            <Footer />
        </>
    );
}

export default Contrataciones;