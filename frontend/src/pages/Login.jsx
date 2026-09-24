import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye } from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { iniciarSesion } from "../services/authService.js";

import "./Login.css";


function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const [mostrarPassword, setMostrarPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setCargando(true);

    try {
      const datos = await iniciarSesion(email, password);

      localStorage.setItem("token", datos.token);

      localStorage.setItem(
        "usuario",
        JSON.stringify(datos.usuario)
      );

      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      <Header />

      <main className="login">
        <div className="login__contenedor">

          <section className="login__presentacion">
            <span>Bienvenido de nuevo</span>

            <h1>
              Volvé a conectar
              <br />
              con tu comunidad
            </h1>

            <p>
              Accedé a tu cuenta para gestionar tus solicitudes,
              propuestas y servicios.
            </p>

            <div className="login__frase">
              Personas reales.
              <br />
              Soluciones cerca tuyo.
            </div>
          </section>

          <section className="login__panel">
            <div className="login__encabezado">
              <h2>Iniciar sesión</h2>

              <p>
                Ingresá tus datos para continuar en Al Rescate.
              </p>
            </div>

            <form
              className="login__formulario"
              onSubmit={handleSubmit}
            >
              <label>
                Email

                <div className="login__campo">
                  <Mail size={19} />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="tu@email.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </label>

              <label>
                Contraseña

                <div className="login__campo">
                  <Lock size={19} />

                  <input
                        type={mostrarPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        placeholder="Tu contraseña"
                        autoComplete="current-password"
                        required
                    />

                    <button
                        type="button"
                        className="login__ver-password"
                        aria-label="Mantener presionado para ver la contraseña"
                        onMouseDown={() => setMostrarPassword(true)}
                        onMouseUp={() => setMostrarPassword(false)}
                        onMouseLeave={() => setMostrarPassword(false)}
                        onTouchStart={() => setMostrarPassword(true)}
                        onTouchEnd={() => setMostrarPassword(false)}
                        >
                        <Eye size={19} />
                    </button>
                </div>
              </label>

              {error && (
                <div className="login__error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login__submit"
                disabled={cargando}
              >
                {cargando
                  ? "Ingresando..."
                  : "Ingresar"}

                {!cargando && <ArrowRight size={19} />}
              </button>
            </form>

            <div className="login__registro">
              ¿Todavía no tenés cuenta?

              <Link to="/registro">
                Registrate
              </Link>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Login;