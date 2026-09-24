import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  CalendarDays,
  ArrowRight,
  Eye,
  CheckCircle2,
} from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { registrarUsuario } from "../services/authService.js";

import "./Registro.css";

function Registro() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    password: "",
    repetirPassword: "",
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarRepetirPassword, setMostrarRepetirPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(false);

  function actualizarCampo(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (formulario.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (formulario.password !== formulario.repetirPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setCargando(true);

    try {
      await registrarUsuario({
        nombre: formulario.nombre,
        apellido: formulario.apellido,
        email: formulario.email,
        telefono: formulario.telefono || null,
        fechaNacimiento: formulario.fechaNacimiento || null,
        password: formulario.password,
      });

      setRegistroExitoso(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  if (registroExitoso) {
    return (
      <>
        <Header />

        <main className="registro registro--exitoso">
          <section className="registro__confirmacion">
            <div className="registro__confirmacion-icono">
              <CheckCircle2 size={38} />
            </div>

            <h1>Revisá tu correo</h1>

            <p>
              Creamos tu cuenta en <strong>Al Rescate</strong> y enviamos
              un enlace de verificación a:
            </p>

            <strong className="registro__email-confirmacion">
              {formulario.email}
            </strong>

            <p>
              Tenés que confirmar tu correo antes de poder iniciar sesión.
            </p>

            <Link to="/login" className="registro__ir-login">
              Ir a iniciar sesión
              <ArrowRight size={18} />
            </Link>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="registro">
        <div className="registro__contenedor">

          <section className="registro__presentacion">
            <span>Sumate a Al Rescate</span>

            <h1>
              Tu comunidad,
              <br />
              más cerca
            </h1>

            <p>
              Creá tu cuenta para pedir ayuda, encontrar soluciones y
              formar parte de una comunidad basada en la confianza.
            </p>

            <div className="registro__frase">
              Personas reales.
              <br />
              Oficios que conectan.
            </div>
          </section>

          <section className="registro__panel">
            <div className="registro__encabezado">
              <h2>Crear cuenta</h2>
              <p>Completá tus datos para comenzar.</p>
            </div>

            <form
              className="registro__formulario"
              onSubmit={handleSubmit}
            >
              <div className="registro__fila">
                <label>
                  Nombre

                  <div className="registro__campo">
                    <User size={18} />

                    <input
                      type="text"
                      name="nombre"
                      value={formulario.nombre}
                      onChange={actualizarCampo}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                </label>

                <label>
                  Apellido

                  <div className="registro__campo">
                    <User size={18} />

                    <input
                      type="text"
                      name="apellido"
                      value={formulario.apellido}
                      onChange={actualizarCampo}
                      placeholder="Tu apellido"
                      required
                    />
                  </div>
                </label>
              </div>

              <label>
                Email

                <div className="registro__campo">
                  <Mail size={18} />

                  <input
                    type="email"
                    name="email"
                    value={formulario.email}
                    onChange={actualizarCampo}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </label>

              <div className="registro__fila">
                <label>
                  Teléfono

                  <div className="registro__campo">
                    <Phone size={18} />

                    <input
                      type="tel"
                      name="telefono"
                      value={formulario.telefono}
                      onChange={actualizarCampo}
                      placeholder="Opcional"
                    />
                  </div>
                </label>

                <label>
                  Fecha de nacimiento

                  <div className="registro__campo">
                    <CalendarDays size={18} />

                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formulario.fechaNacimiento}
                      onChange={actualizarCampo}
                    />
                  </div>
                </label>
              </div>

              <label>
                Contraseña

                <div className="registro__campo">
                  <Lock size={18} />

                  <input
                    type={mostrarPassword ? "text" : "password"}
                    name="password"
                    value={formulario.password}
                    onChange={actualizarCampo}
                    placeholder="Mínimo 8 caracteres"
                    required
                  />

                  <button
                    type="button"
                    className="registro__ver-password"
                    onMouseDown={() => setMostrarPassword(true)}
                    onMouseUp={() => setMostrarPassword(false)}
                    onMouseLeave={() => setMostrarPassword(false)}
                    onTouchStart={() => setMostrarPassword(true)}
                    onTouchEnd={() => setMostrarPassword(false)}
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </label>

              <label>
                Repetir contraseña

                <div className="registro__campo">
                  <Lock size={18} />

                  <input
                    type={
                      mostrarRepetirPassword ? "text" : "password"
                    }
                    name="repetirPassword"
                    value={formulario.repetirPassword}
                    onChange={actualizarCampo}
                    placeholder="Repetí tu contraseña"
                    required
                  />

                  <button
                    type="button"
                    className="registro__ver-password"
                    onMouseDown={() =>
                      setMostrarRepetirPassword(true)
                    }
                    onMouseUp={() =>
                      setMostrarRepetirPassword(false)
                    }
                    onMouseLeave={() =>
                      setMostrarRepetirPassword(false)
                    }
                    onTouchStart={() =>
                      setMostrarRepetirPassword(true)
                    }
                    onTouchEnd={() =>
                      setMostrarRepetirPassword(false)
                    }
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </label>

              {error && (
                <div className="registro__error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="registro__submit"
                disabled={cargando}
              >
                {cargando ? "Creando cuenta..." : "Crear cuenta"}

                {!cargando && <ArrowRight size={19} />}
              </button>
            </form>

            <div className="registro__login">
              ¿Ya tenés una cuenta?
              <Link to="/login">Ingresá</Link>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Registro;