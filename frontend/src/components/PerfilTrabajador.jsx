import { useEffect, useState } from "react";

import {
  BriefcaseBusiness,
  MapPin,
  Clock3,
  CheckCircle2,
  X,
  Pencil,
  Power,
} from "lucide-react";

import {
  crearMiPerfilTrabajador,
  obtenerMiPerfilTrabajador,
  actualizarMiPerfilTrabajador,
} from "../services/trabajadoresService.js";

import { obtenerPerfil } from "../services/authService.js";
import "./PerfilTrabajador.css";
import CategoriasTrabajador from "./CategoriasTrabajador.jsx";

function PerfilTrabajador({
  usuario,
  onUsuarioActualizado,
}) {
  const esTrabajador = usuario.roles.some(
    (rol) => rol.nombre === "TRABAJADOR"
  );

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [editandoPerfil, setEditandoPerfil] =
    useState(false);


  const [perfil, setPerfil] = useState(null);
  const [cargandoPerfil, setCargandoPerfil] =
    useState(false);

  const [guardando, setGuardando] = useState(false);
  const [cambiandoDisponibilidad, setCambiandoDisponibilidad] =
    useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const [formulario, setFormulario] = useState({
    tituloProfesional: "",
    descripcion: "",
    zonaTrabajo: "",
    aniosExperiencia: "",
  });

  useEffect(() => {
    if (!esTrabajador) {
      return;
    }

    async function cargarPerfilTrabajador() {
      setCargandoPerfil(true);
      setError("");

      try {
        const datos =
          await obtenerMiPerfilTrabajador();

        setPerfil(datos);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargandoPerfil(false);
      }
    }

    cargarPerfilTrabajador();
  }, [esTrabajador]);

  function iniciarEdicion() {
    setFormulario({
        tituloProfesional: perfil.tituloProfesional || "",
        descripcion: perfil.descripcion || "",
        zonaTrabajo: perfil.zonaTrabajo || "",
        aniosExperiencia:
        perfil.aniosExperiencia ?? "",
    });

    setError("");
    setExito("");
    setEditandoPerfil(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function handleCrear(event) {
    event.preventDefault();

    setError("");
    setExito("");
    setGuardando(true);

    try {
      await crearMiPerfilTrabajador({
        tituloProfesional:
          formulario.tituloProfesional.trim(),
        descripcion: formulario.descripcion.trim(),
        zonaTrabajo: formulario.zonaTrabajo.trim(),
        aniosExperiencia:
          formulario.aniosExperiencia === ""
            ? undefined
            : Number(formulario.aniosExperiencia),
      });

      const usuarioActualizado =
        await obtenerPerfil();

      localStorage.setItem(
        "usuario",
        JSON.stringify(usuarioActualizado)
      );

      onUsuarioActualizado(usuarioActualizado);

      setMostrarFormulario(false);

      setExito(
        "Tu perfil profesional fue creado correctamente."
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

    async function handleActualizar(event) {
        event.preventDefault();

        setError("");
        setExito("");
        setGuardando(true);

        try {
            const datos =
                await actualizarMiPerfilTrabajador({
                    tituloProfesional:
                        formulario.tituloProfesional.trim(),
                    descripcion:
                        formulario.descripcion.trim(),
                    zonaTrabajo:
                        formulario.zonaTrabajo.trim(),
                    aniosExperiencia:
                        formulario.aniosExperiencia === ""
                            ? undefined
                            : Number(formulario.aniosExperiencia),
                    disponible: perfil.disponible,
                });

            setPerfil(datos.perfil);

            setEditandoPerfil(false);

            setExito(
                "Tu perfil profesional fue actualizado correctamente."
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setGuardando(false);
        }
    }

    async function cambiarDisponibilidad() {
        setError("");
        setExito("");
        setCambiandoDisponibilidad(true);

        try {
            const datos =
                await actualizarMiPerfilTrabajador({
                    disponible: !perfil.disponible,
                });

            setPerfil(datos.perfil);

            setExito(
                datos.perfil.disponible
                    ? "Ahora estás disponible para recibir trabajos."
                    : "Marcaste tu perfil como no disponible."
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setCambiandoDisponibilidad(false);
        }
    }

    return (
        <section className="perfil-trabajador">

            <div className="perfil-trabajador__cabecera">
                <div className="perfil-trabajador__titulo">
                    <BriefcaseBusiness size={21} />

                    <div>
                        <h2>Perfil profesional</h2>

                        <p>
                            Información sobre los servicios que ofrecés.
                        </p>
                    </div>
                </div>

                {!esTrabajador && !mostrarFormulario && (
                    <button
                        type="button"
                        className="perfil-trabajador__activar"
                        onClick={() => {
                            setError("");
                            setExito("");
                            setMostrarFormulario(true);
                        }}
                    >
                        Quiero ofrecer servicios
                    </button>
                )}
            </div>

            {exito && (
                <div className="perfil-trabajador__exito">
                    <CheckCircle2 size={18} />
                    {exito}
                </div>
            )}

            {error && (
                <div className="perfil-trabajador__error">
                    {error}
                </div>
            )}

            {!esTrabajador && !mostrarFormulario && (
                <div className="perfil-trabajador__inactivo">
                    <p>
                        Si querés trabajar a través de Al Rescate,
                        podés crear tu perfil profesional.
                    </p>
                </div>
            )}

            {!esTrabajador && mostrarFormulario && (
                <form
                    className="perfil-trabajador__formulario"
                    onSubmit={handleCrear}
                >
                    <label>
                        Título profesional

                        <input
                            type="text"
                            name="tituloProfesional"
                            value={formulario.tituloProfesional}
                            onChange={handleChange}
                            placeholder="Ej: Electricista domiciliario"
                        />
                    </label>

                    <label>
                        Zona de trabajo

                        <input
                            type="text"
                            name="zonaTrabajo"
                            value={formulario.zonaTrabajo}
                            onChange={handleChange}
                            placeholder="Ej: CABA y Zona Sur"
                        />
                    </label>

                    <label>
                        Años de experiencia

                        <input
                            type="number"
                            min="0"
                            name="aniosExperiencia"
                            value={formulario.aniosExperiencia}
                            onChange={handleChange}
                            placeholder="Ej: 5"
                        />
                    </label>

                    <label className="perfil-trabajador__descripcion">
                        Presentación

                        <textarea
                            name="descripcion"
                            value={formulario.descripcion}
                            onChange={handleChange}
                            placeholder="Contanos brevemente sobre tu experiencia y los trabajos que realizás..."
                            rows="5"
                        />
                    </label>

                    <div className="perfil-trabajador__acciones">
                        <button
                            type="button"
                            className="perfil-trabajador__cancelar"
                            onClick={() =>
                                setMostrarFormulario(false)
                            }
                            disabled={guardando}
                        >
                            <X size={17} />
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="perfil-trabajador__guardar"
                            disabled={guardando}
                        >
                            <BriefcaseBusiness size={17} />

                            {guardando
                                ? "Creando perfil..."
                                : "Crear perfil profesional"}
                        </button>
                    </div>
                </form>
            )}

            {esTrabajador && cargandoPerfil && (
                <p className="perfil-trabajador__cargando">
                    Cargando perfil profesional...
                </p>
            )}

            {esTrabajador &&
                perfil &&
                !editandoPerfil && (
                    <div className="perfil-trabajador__editar-contenedor">
                        <button
                            type="button"
                            className="perfil-trabajador__editar"
                            onClick={iniciarEdicion}
                        >
                            <Pencil size={16} />
                            Editar perfil profesional
                        </button>
                    </div>
                )}

            {esTrabajador && perfil && !editandoPerfil && (
                <div className="perfil-trabajador__datos">

                    <div className="perfil-trabajador__principal">
                        <h3>
                            {perfil.tituloProfesional ||
                                "Trabajador de Al Rescate"}
                        </h3>

                        <p>
                            {perfil.descripcion ||
                                "Todavía no agregó una presentación."}
                        </p>
                    </div>

                    <div className="perfil-trabajador__detalle perfil-trabajador__detalle--disponibilidad">
                        <span>
                            <Power size={17} />
                            Disponibilidad
                        </span>

                        <div className="perfil-trabajador__disponibilidad">
                            <div>
                                <strong>
                                    {perfil.disponible
                                        ? "Disponible"
                                        : "No disponible"}
                                </strong>

                                <small>
                                    {perfil.disponible
                                        ? "Podés recibir nuevas oportunidades."
                                        : "No recibirás nuevas oportunidades por ahora."}
                                </small>
                            </div>

                            <button
                                type="button"
                                className={
                                    perfil.disponible
                                        ? "perfil-trabajador__switch perfil-trabajador__switch--activo"
                                        : "perfil-trabajador__switch"
                                }
                                onClick={cambiarDisponibilidad}
                                disabled={cambiandoDisponibilidad}
                                aria-label="Cambiar disponibilidad"
                            >
                                <span />
                            </button>
                        </div>
                    </div>

                    <div className="perfil-trabajador__detalle">
                        <span>
                            <Clock3 size={17} />
                            Experiencia
                        </span>

                        <strong>
                            {perfil.aniosExperiencia !== null
                                ? `${perfil.aniosExperiencia} años`
                                : "No informada"}
                        </strong>
                    </div>

                    <div className="perfil-trabajador__detalle">
                        <span>Disponibilidad</span>

                        <strong>
                            {perfil.disponible
                                ? "Disponible"
                                : "No disponible"}
                        </strong>
                    </div>

                </div>
            )}

            {esTrabajador && perfil && !editandoPerfil && (
                <CategoriasTrabajador />
            )}

            {esTrabajador && perfil && editandoPerfil && (
                <form
                    className="perfil-trabajador__formulario"
                    onSubmit={handleActualizar}
                >
                    <label>
                        Título profesional

                        <input
                            type="text"
                            name="tituloProfesional"
                            value={formulario.tituloProfesional}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Zona de trabajo

                        <input
                            type="text"
                            name="zonaTrabajo"
                            value={formulario.zonaTrabajo}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Años de experiencia

                        <input
                            type="number"
                            min="0"
                            name="aniosExperiencia"
                            value={formulario.aniosExperiencia}
                            onChange={handleChange}
                        />
                    </label>

                    <label className="perfil-trabajador__descripcion">
                        Presentación

                        <textarea
                            name="descripcion"
                            value={formulario.descripcion}
                            onChange={handleChange}
                            rows="5"
                        />
                    </label>

                    <div className="perfil-trabajador__acciones">

                        <button
                            type="button"
                            className="perfil-trabajador__cancelar"
                            onClick={() =>
                                setEditandoPerfil(false)
                            }
                            disabled={guardando}
                        >
                            <X size={17} />
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="perfil-trabajador__guardar"
                            disabled={guardando}
                        >
                            <BriefcaseBusiness size={17} />

                            {guardando
                                ? "Guardando..."
                                : "Guardar cambios"}
                        </button>

                    </div>
                </form>
            )}

        </section>
    );
}




export default PerfilTrabajador;