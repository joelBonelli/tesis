import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import { solicitarRecuperacionPassword } from "../services/authService.js";

import "./RecuperarPassword.css";

function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setCargando(true);

    try {
      await solicitarRecuperacionPassword(email);

      setEnviado(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      <Header />

      <main className="recuperar-password">
        <section className="recuperar-password__panel">

          {!enviado ? (
            <>
              <span className="recuperar-password__eyebrow">
                Recuperar acceso
              </span>

              <h1>¿Olvidaste tu contraseña?</h1>

              <p>
                Ingresá el email asociado a tu cuenta y te
                enviaremos un enlace para crear una nueva contraseña.
              </p>

              <form
                className="recuperar-password__formulario"
                onSubmit={handleSubmit}
              >
                <label>
                  Email

                  <div className="recuperar-password__campo">
                    <Mail size={19} />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </label>

                {error && (
                  <div className="recuperar-password__error">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="recuperar-password__boton"
                  disabled={cargando}
                >
                  {cargando
                    ? "Enviando..."
                    : "Enviar enlace"}

                  {!cargando && <ArrowRight size={18} />}
                </button>
              </form>

              <Link
                to="/login"
                className="recuperar-password__volver"
              >
                Volver a iniciar sesión
              </Link>
            </>
          ) : (
            <div className="recuperar-password__confirmacion">
              <div className="recuperar-password__icono">
                <CheckCircle2 size={38} />
              </div>

              <h1>Revisá tu correo</h1>

              <p>
                Si existe una cuenta asociada a
                <strong> {email}</strong>, vas a recibir un enlace
                para restablecer tu contraseña.
              </p>

              <Link
                to="/login"
                className="recuperar-password__boton"
              >
                Volver al login
              </Link>
            </div>
          )}

        </section>
      </main>

      <Footer />
    </>
  );
}

export default RecuperarPassword;