import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import "./Header.css";

function Header() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(() => {
        const token = localStorage.getItem("token");
        const usuarioGuardado = localStorage.getItem("usuario");

        if (!token || !usuarioGuardado) {
            return null;
        }

        try {
            return JSON.parse(usuarioGuardado);
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");

            return null;
        }
    });

    function cerrarSesion() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        setUsuario(null);

        navigate("/");
    }


  return (
    <header className="header">
      <div className="header__contenido">
        <Link to="/" className="header__logo">
          <span className="header__logo-icono">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M3 11.5 12 4l9 7.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M5.5 10.5V20h13v-9.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <div className="header__marca">
            <span className="header__nombre">Al Rescate</span>
            <span className="header__frase">
              Gente de confianza, cerca tuyo
            </span>
          </div>
        </Link>

        <nav className="header__nav">
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#trabajadores">Para trabajadores</a>
          <a href="#ayuda">Ayuda</a>
        </nav>

              <div className="header__acciones">
                  {usuario ? (
                      <div className="header__sesion">

                          <div className="header__avatar">
                              {usuario.nombre?.charAt(0).toUpperCase()}
                          </div>

                          <div className="header__usuario">
                              <span>Hola,</span>
                              <strong>{usuario.nombre}</strong>
                          </div>

                          <button
                              type="button"
                              className="header__cerrar-sesion"
                              onClick={cerrarSesion}
                          >
                              <LogOut size={17} />
                              Salir
                          </button>

                      </div>
                  ) : (
                      <>
                          <Link
                              to="/login"
                              className="header__boton header__boton--login"
                          >
                              Ingresar
                          </Link>

                          <Link
                              to="/registro"
                              className="header__boton header__boton--registro"
                          >
                              Registrarse
                          </Link>
                      </>
                  )}
              </div>
      </div>
    </header>
  );
}

export default Header;