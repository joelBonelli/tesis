import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Phone,
  CalendarDays,
  BadgeCheck,
  Pencil,
  ArrowLeft,
  Save,
  X,
  CheckCircle2,
  Camera,
  LoaderCircle,
} from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import CambioPassword from "../components/CambioPassword.jsx";
import PerfilTrabajador from "../components/PerfilTrabajador.jsx";

import {
  obtenerPerfil,
  actualizarPerfil,
  actualizarFotoPerfil,
} from "../services/authService.js";

import "./Perfil.css";

function Perfil() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    fechaNacimiento: "",
  });

  useEffect(() => {
    async function cargarPerfil() {
      try {
        const datos = await obtenerPerfil();

        setUsuario(datos);

        setFormulario({
          nombre: datos.nombre || "",
          apellido: datos.apellido || "",
          telefono: datos.telefono || "",
          fechaNacimiento: datos.fechaNacimiento
            ? datos.fechaNacimiento.substring(0, 10)
            : "",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarPerfil();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

    async function handleFotoChange(event) {
        const archivo = event.target.files?.[0];

        if (!archivo) {
            return;
        }

        setError("");
        setMensajeExito("");

        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!tiposPermitidos.includes(archivo.type)) {
            setError(
                "La foto debe ser JPG, PNG o WEBP"
            );

            event.target.value = "";
            return;
        }

        if (archivo.size > 5 * 1024 * 1024) {
            setError(
                "La imagen no puede superar los 5 MB"
            );

            event.target.value = "";
            return;
        }

        setSubiendoFoto(true);

        try {
            const datos = await actualizarFotoPerfil(archivo);

            setUsuario(datos.usuario);

            localStorage.setItem(
                "usuario",
                JSON.stringify(datos.usuario)
            );

            setMensajeExito(
                "Foto de perfil actualizada correctamente."
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setSubiendoFoto(false);

            event.target.value = "";
        }
    }



  function cancelarEdicion() {
    setFormulario({
      nombre: usuario.nombre || "",
      apellido: usuario.apellido || "",
      telefono: usuario.telefono || "",
      fechaNacimiento: usuario.fechaNacimiento
        ? usuario.fechaNacimiento.substring(0, 10)
        : "",
    });

    setError("");
    setMensajeExito("");
    setEditando(false);
  }

  async function handleGuardar(event) {
    event.preventDefault();

    setError("");
    setMensajeExito("");

    if (!formulario.nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    if (!formulario.apellido.trim()) {
      setError("El apellido es obligatorio");
      return;
    }

    setGuardando(true);

    try {
      const datos = await actualizarPerfil({
        nombre: formulario.nombre.trim(),
        apellido: formulario.apellido.trim(),
        telefono: formulario.telefono.trim(),
        fechaNacimiento: formulario.fechaNacimiento,
      });

      setUsuario(datos.usuario);

      localStorage.setItem(
        "usuario",
        JSON.stringify(datos.usuario)
      );

      setFormulario({
        nombre: datos.usuario.nombre || "",
        apellido: datos.usuario.apellido || "",
        telefono: datos.usuario.telefono || "",
        fechaNacimiento: datos.usuario.fechaNacimiento
          ? datos.usuario.fechaNacimiento.substring(0, 10)
          : "",
      });

      setEditando(false);

      setMensajeExito(
        "Tus datos fueron actualizados correctamente."
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <>
        <Header />

        <main className="perfil perfil--estado">
          <p>Cargando perfil...</p>
        </main>

        <Footer />
      </>
    );
  }

  if (!usuario) {
    return (
      <>
        <Header />

        <main className="perfil perfil--estado">
          <p>{error || "No se pudo cargar el perfil."}</p>
        </main>

        <Footer />
      </>
    );
  }

  const iniciales =
    `${usuario.nombre?.charAt(0) || ""}${usuario.apellido?.charAt(0) || ""}`
      .toUpperCase();

  const fechaNacimiento = usuario.fechaNacimiento
    ? new Date(usuario.fechaNacimiento).toLocaleDateString(
        "es-AR",
        {
          timeZone: "UTC",
        }
      )
    : "No informada";

  return (
    <>
      <Header />

      <main className="perfil">
        <div className="perfil__contenido">

          <button
            type="button"
            className="perfil__volver"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={18} />
            Volver a mi cuenta
          </button>

          <section className="perfil__cabecera">

            <div className="perfil__foto-contenedor">

            <div className="perfil__avatar">
                {usuario.fotoPerfilUrl ? (
                    <img
                        src={usuario.fotoPerfilUrl}
                        alt={`Foto de ${usuario.nombre}`}
                    />
                ) : (
                    iniciales
                )}
            </div>

            <label className="perfil__cambiar-foto">

                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFotoChange}
                    disabled={subiendoFoto}
                />

                {subiendoFoto ? (
                    <>
                        <LoaderCircle
                            size={16}
                            className="perfil__foto-cargando"
                        />

                        Subiendo...
                    </>
                ) : (
                    <>
                        <Camera size={16} />
                        Cambiar foto
                    </>
                )}

            </label>

            </div>

            <div className="perfil__identidad">
              <div className="perfil__nombre">
                <h1>
                  {usuario.nombre} {usuario.apellido}
                </h1>

                {usuario.estaVerificado && (
                  <BadgeCheck
                    size={22}
                    className="perfil__verificado"
                  />
                )}
              </div>

              <p>{usuario.email}</p>

              <div className="perfil__roles">
                {usuario.roles.map((rol) => (
                  <span key={rol.id}>
                    {rol.nombre}
                  </span>
                ))}
              </div>
            </div>

            {!editando && (
              <button
                type="button"
                className="perfil__editar"
                onClick={() => {
                  setError("");
                  setMensajeExito("");
                  setEditando(true);
                }}
              >
                <Pencil size={17} />
                Editar perfil
              </button>
            )}

          </section>

          {mensajeExito && (
            <div className="perfil__mensaje-exito">
              <CheckCircle2 size={18} />
              {mensajeExito}
            </div>
          )}

          {error && (
            <div className="perfil__mensaje-error">
              {error}
            </div>
          )}

          <section className="perfil__seccion">

            <div className="perfil__seccion-titulo">
              <User size={21} />

              <div>
                <h2>Datos personales</h2>
                <p>Información asociada a tu cuenta.</p>
              </div>
            </div>

            {!editando ? (
              <div className="perfil__datos">

                <div className="perfil__dato">
                  <span>Nombre</span>
                  <strong>{usuario.nombre}</strong>
                </div>

                <div className="perfil__dato">
                  <span>Apellido</span>
                  <strong>{usuario.apellido}</strong>
                </div>

                <div className="perfil__dato">
                  <span>
                    <Mail size={15} />
                    Email
                  </span>

                  <strong>{usuario.email}</strong>
                </div>

                <div className="perfil__dato">
                  <span>
                    <Phone size={15} />
                    Teléfono
                  </span>

                  <strong>
                    {usuario.telefono || "No informado"}
                  </strong>
                </div>

                <div className="perfil__dato">
                  <span>
                    <CalendarDays size={15} />
                    Fecha de nacimiento
                  </span>

                  <strong>{fechaNacimiento}</strong>
                </div>

                <div className="perfil__dato">
                  <span>Estado de cuenta</span>

                  <strong className="perfil__estado">
                    {usuario.estaVerificado
                      ? "Email verificado"
                      : "Email pendiente"}
                  </strong>
                </div>

              </div>
            ) : (
              <form
                className="perfil__formulario"
                onSubmit={handleGuardar}
              >

                <div className="perfil__form-grid">

                  <label>
                    Nombre

                    <input
                      type="text"
                      name="nombre"
                      value={formulario.nombre}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label>
                    Apellido

                    <input
                      type="text"
                      name="apellido"
                      value={formulario.apellido}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label>
                    Teléfono

                    <input
                      type="tel"
                      name="telefono"
                      value={formulario.telefono}
                      onChange={handleChange}
                      placeholder="No informado"
                    />
                  </label>

                  <label>
                    Fecha de nacimiento

                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formulario.fechaNacimiento}
                      onChange={handleChange}
                    />
                  </label>

                  <label className="perfil__email-bloqueado">
                    Email

                    <input
                      type="email"
                      value={usuario.email}
                      disabled
                    />

                    <small>
                      El cambio de email lo habilitaremos
                      posteriormente.
                    </small>
                  </label>

                </div>

                <div className="perfil__form-acciones">

                  <button
                    type="button"
                    className="perfil__cancelar"
                    onClick={cancelarEdicion}
                    disabled={guardando}
                  >
                    <X size={17} />
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="perfil__guardar"
                    disabled={guardando}
                  >
                    <Save size={17} />

                    {guardando
                      ? "Guardando..."
                      : "Guardar cambios"}
                  </button>

                </div>

              </form>
            )}

          </section>
          <PerfilTrabajador
            usuario={usuario}
            onUsuarioActualizado={(usuarioActualizado) => {
              setUsuario(usuarioActualizado);

              localStorage.setItem(
                "usuario",
                JSON.stringify(usuarioActualizado)
              );
            }}
          />  
          <CambioPassword />  
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Perfil;