import { useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  Lock,
  Eye,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import { restablecerPassword } from "../services/authService.js";

import "./RestablecerPassword.css";

function RestablecerPassword() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarRepetir, setMostrarRepetir] = useState(false);

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!token) {
      setError("El enlace de recuperación no es válido.");
      return;
    }

    if (password.length < 8) {
      setError(
        "La contraseña debe tener al menos 8 caracteres"
      );
      return;
    }

    if (password !== repetirPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setCargando(true);

    try {
      await restablecerPassword(token, password);

      setExito(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      <Header />

      <main className="restablecer-password">
        <section className="restablecer-password__panel">

          {exito ? (
            <div className="restablecer-password__exito">

              <div className="restablecer-password__icono restablecer-password__icono--exito">
                <CheckCircle2 size={38} />
              </div>

              <h1>Contraseña actualizada</h1>

              <p>
                Ya podés iniciar sesión en Al Rescate con tu nueva
                contraseña.
              </p>

              <Link
                to="/login"
                className="restablecer-password__boton"
              >
                Iniciar sesión
                <ArrowRight size={18} />
              </Link>

            </div>
          ) : (
            <>
              <span className="restablecer-password__eyebrow">
                Recuperar acceso
              </span>

              <h1>Creá una nueva contraseña</h1>

              <p>
                Elegí una contraseña nueva para volver a acceder a
                tu cuenta.
              </p>

              {!token && (
                <div className="restablecer-password__error">
                  <CircleAlert size={18} />
                  El enlace de recuperación no es válido.
                </div>
              )}

              {token && (
                <form
                  className="restablecer-password__formulario"
                  onSubmit={handleSubmit}
                >
                  <label>
                    Nueva contraseña

                    <div className="restablecer-password__campo">
                      <Lock size={19} />

                      <input
                        type={
                          mostrarPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                        placeholder="Mínimo 8 caracteres"
                        required
                      />

                      <button
                        type="button"
                        className="restablecer-password__ver"
                        onMouseDown={() =>
                          setMostrarPassword(true)
                        }
                        onMouseUp={() =>
                          setMostrarPassword(false)
                        }
                        onMouseLeave={() =>
                          setMostrarPassword(false)
                        }
                        onTouchStart={() =>
                          setMostrarPassword(true)
                        }
                        onTouchEnd={() =>
                          setMostrarPassword(false)
                        }
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </label>

                  <label>
                    Repetir contraseña

                    <div className="restablecer-password__campo">
                      <Lock size={19} />

                      <input
                        type={
                          mostrarRepetir
                            ? "text"
                            : "password"
                        }
                        value={repetirPassword}
                        onChange={(event) =>
                          setRepetirPassword(event.target.value)
                        }
                        placeholder="Repetí tu contraseña"
                        required
                      />

                      <button
                        type="button"
                        className="restablecer-password__ver"
                        onMouseDown={() =>
                          setMostrarRepetir(true)
                        }
                        onMouseUp={() =>
                          setMostrarRepetir(false)
                        }
                        onMouseLeave={() =>
                          setMostrarRepetir(false)
                        }
                        onTouchStart={() =>
                          setMostrarRepetir(true)
                        }
                        onTouchEnd={() =>
                          setMostrarRepetir(false)
                        }
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </label>

                  {error && (
                    <div className="restablecer-password__error">
                      <CircleAlert size={18} />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="restablecer-password__boton"
                    disabled={cargando}
                  >
                    {cargando
                      ? "Actualizando..."
                      : "Guardar nueva contraseña"}

                    {!cargando && (
                      <ArrowRight size={18} />
                    )}
                  </button>

                </form>
              )}

            </>
          )}

        </section>
      </main>

      <Footer />
    </>
  );
}

export default RestablecerPassword;