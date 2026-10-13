import { useEffect, useState } from "react";
import {
	Link,
	useNavigate,
	useParams,
} from "react-router-dom";

import {
	ArrowLeft,
	CalendarDays,
	MapPin,
	UserRound,
	BadgeCheck,
	Star,
	MessageCircle,
	Banknote,
	Clock3,
} from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import {
  obtenerContratacionPorId,
  finalizarContratacion,
  cancelarContratacion,
} from "../services/contratacionesService.js";

import "./DetalleContratacion.css";

function DetalleContratacion() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [contratacion, setContratacion] =
		useState(null);

	const [participacion, setParticipacion] =
		useState("");

	const [cargando, setCargando] =
		useState(true);

	const [error, setError] = useState("");
	const [accionando, setAccionando] = useState(false);
	const [mensaje, setMensaje] = useState("");

	useEffect(() => {
		async function cargarContratacion() {
			try {
				const datos =
					await obtenerContratacionPorId(id);

				setContratacion(datos.contratacion);
				setParticipacion(datos.participacion);
			} catch (error) {
				setError(error.message);
			} finally {
				setCargando(false);
			}
		}

		cargarContratacion();
	}, [id]);

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

	async function handleFinalizar() {
  const confirmar = window.confirm(
    "¿Confirmás que el trabajo fue finalizado?"
  );

  if (!confirmar) {
    return;
  }

  setAccionando(true);
  setError("");
  setMensaje("");

  try {
    const datos = await finalizarContratacion(id);

    setContratacion((anterior) => ({
      ...anterior,
      estado: "FINALIZADA",
      fechaFinalizacion:
        datos.contratacion.fechaFinalizacion,
    }));

    setMensaje(
      "La contratación fue finalizada correctamente."
    );
  } catch (error) {
    setError(error.message);
  } finally {
    setAccionando(false);
  }
}

async function handleCancelar() {
  const confirmar = window.confirm(
    "¿Seguro que querés cancelar esta contratación?"
  );

  if (!confirmar) {
    return;
  }

  setAccionando(true);
  setError("");
  setMensaje("");

  try {
    await cancelarContratacion(id);

    setContratacion((anterior) => ({
      ...anterior,
      estado: "CANCELADA",
    }));

    setMensaje(
      "La contratación fue cancelada correctamente."
    );
  } catch (error) {
    setError(error.message);
  } finally {
    setAccionando(false);
  }
}

	if (cargando) {
		return (
			<>
				<Header />

				<main className="detalle-contratacion detalle-contratacion--estado">
					Cargando contratación...
				</main>

				<Footer />
			</>
		);
	}

	if (!contratacion) {
		return (
			<>
				<Header />

				<main className="detalle-contratacion detalle-contratacion--estado">
					{error || "Contratación no encontrada"}
				</main>

				<Footer />
			</>
		);
	}

	const trabajador =
		contratacion.propuesta.perfilTrabajador;

	const usuarioTrabajador =
		trabajador.usuario;

	const cliente =
		contratacion.solicitud.cliente;

	const otraPersona =
		participacion === "CLIENTE"
			? usuarioTrabajador
			: cliente;

	const iniciales =
		`${otraPersona.nombre?.charAt(0) || ""}${otraPersona.apellido?.charAt(0) || ""}`.toUpperCase();

	return (
		<>
			<Header />

			<main className="detalle-contratacion">
				<div className="detalle-contratacion__contenido">

					<button
						type="button"
						className="detalle-contratacion__volver"
						onClick={() =>
							navigate("/contrataciones")
						}
					>
						<ArrowLeft size={18} />
						Volver a contrataciones
					</button>

					<section className="detalle-contratacion__principal">

						<div className="detalle-contratacion__cabecera">

							<div>
								<span className="detalle-contratacion__categoria">
									{
										contratacion.solicitud
											.categoria.nombre
									}
								</span>

								<h1>
									{contratacion.solicitud.titulo}
								</h1>
							</div>

							<span
								className={`detalle-contratacion__estado detalle-contratacion__estado--${contratacion.estado.toLowerCase()}`}
							>
								{textoEstado(
									contratacion.estado
								)}
							</span>

						</div>

						<p className="detalle-contratacion__descripcion">
							{
								contratacion.solicitud
									.descripcion
							}
						</p>

						<div className="detalle-contratacion__datos">

							<div>
								<Banknote size={19} />

								<span>
									<small>Monto acordado</small>

									<strong>
										$
										{Number(
											contratacion.montoAcordado
										).toLocaleString("es-AR")}
									</strong>
								</span>
							</div>

							<div>
								<CalendarDays size={19} />

								<span>
									<small>
										Fecha de contratación
									</small>

									<strong>
										{formatearFecha(
											contratacion.fechaContratacion
										)}
									</strong>
								</span>
							</div>

							{contratacion.solicitud.zona && (
								<div>
									<MapPin size={19} />

									<span>
										<small>Zona</small>

										<strong>
											{
												contratacion.solicitud
													.zona
											}
										</strong>
									</span>
								</div>
							)}

							{contratacion.propuesta
								.diasEstimados && (
									<div>
										<Clock3 size={19} />

										<span>
											<small>
												Tiempo estimado
											</small>

											<strong>
												{
													contratacion.propuesta
														.diasEstimados
												}{" "}
												días
											</strong>
										</span>
									</div>
								)}

						</div>

					</section>

					<div className="detalle-contratacion__columnas">

						<section className="detalle-contratacion__persona">

							<h2>
								{participacion === "CLIENTE"
									? "Trabajador contratado"
									: "Cliente"}
							</h2>

							<div className="detalle-contratacion__persona-info">

								<div className="detalle-contratacion__avatar">
									{otraPersona.fotoPerfilUrl ? (
										<img
											src={
												otraPersona.fotoPerfilUrl
											}
											alt={`Foto de ${otraPersona.nombre}`}
										/>
									) : (
										iniciales
									)}
								</div>

								<div>
									<div className="detalle-contratacion__nombre">

										<strong>
											{otraPersona.nombre}{" "}
											{otraPersona.apellido}
										</strong>

										{otraPersona.estaVerificado && (
											<BadgeCheck size={17} />
										)}

									</div>

									{participacion === "CLIENTE" &&
										trabajador.tituloProfesional && (
											<span>
												{
													trabajador.tituloProfesional
												}
											</span>
										)}

								</div>

							</div>

							{participacion === "CLIENTE" && (
								<>
									<div className="detalle-contratacion__reputacion">
										<span>
											<Star size={16} />
											{Number(
												trabajador.calificacion ||
												0
											).toFixed(1)}
										</span>

										<span>
											{
												trabajador.trabajosRealizados
											}{" "}
											trabajos realizados
										</span>
									</div>

									<Link
										to={`/trabajadores/${usuarioTrabajador.id}`}
										className="detalle-contratacion__perfil"
									>
										<UserRound size={17} />
										Ver perfil del trabajador
									</Link>
								</>
							)}

						</section>

						<section className="detalle-contratacion__propuesta">

							<h2>Propuesta acordada</h2>

							{contratacion.propuesta.mensaje ? (
								<p>
									{
										contratacion.propuesta
											.mensaje
									}
								</p>
							) : (
								<p>
									El trabajador no agregó un
									mensaje a la propuesta.
								</p>
							)}

							<div className="detalle-contratacion__monto">
								<span>Precio acordado</span>

								<strong>
									$
									{Number(
										contratacion.montoAcordado
									).toLocaleString("es-AR")}
								</strong>
							</div>

						</section>

					</div>

					<section className="detalle-contratacion__acciones">

						<button
							type="button"
							className="detalle-contratacion__chat"
							disabled
						>
							<MessageCircle size={18} />
							Abrir chat
						</button>

						{contratacion.estado === "EN_PROCESO" && (
							<>
								{participacion === "CLIENTE" && (
									<button
										type="button"
										className="detalle-contratacion__finalizar"
										onClick={handleFinalizar}
										disabled={accionando}
									>
										Finalizar trabajo
									</button>
								)}

								<button
									type="button"
									className="detalle-contratacion__cancelar"
									onClick={handleCancelar}
									disabled={accionando}
								>
									Cancelar contratación
								</button>
							</>
						)}

					</section>

{mensaje && (
  <div className="detalle-contratacion__mensaje-exito">
    {mensaje}
  </div>
)}

{error && (
  <div className="detalle-contratacion__mensaje-error">
    {error}
  </div>
)}

				</div>
			</main>

			<Footer />
		</>
	);
}

export default DetalleContratacion;