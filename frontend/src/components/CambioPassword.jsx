import { useState } from "react";

import {
  Lock,
  Eye,
  ShieldCheck,
  CheckCircle2,
  CircleAlert,
  X,
} from "lucide-react";

import { cambiarPassword } from "../services/authService.js";

import "./CambioPassword.css";

function CambioPassword() {
  const [editando, setEditando] = useState(false);

  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");

  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarRepetir, setMostrarRepetir] = useState(false);

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  function limpiarFormulario() {
    setPasswordActual("");
    setPasswordNueva("");
    setRepetirPassword("");
    setError("");
  }

  function cancelar() {
    limpiarFormulario();
    setEditando(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setExito("");

    if (passwordNueva.length < 8) {
      setError(
        "La nueva contraseña debe tener al menos 8 caracteres"
      );
      return;
    }

    if (passwordNueva !== repetirPassword) {
      setError("Las nuevas contraseñas no coinciden");
      return;
    }

    setGuardando(true);

    try {
      const datos = await cambiarPassword(
        passwordActual,
        passwordNueva
      );

      setExito(datos.message);

      limpiarFormulario();
      setEditando(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className="cambio-password">

      <div className="cambio-password__cabecera">
        <div className="cambio-password__titulo">
          <ShieldCheck size={21} />

          <div>
            <h2>Seguridad</h2>
            <p>
              Administrá la contraseña de tu cuenta.
            </p>
          </div>
        </div>

        {!editando && (
          <button
            type="button"
            className="cambio-password__abrir"
            onClick={() => {
              setExito("");
              setError("");
              setEditando(true);
            }}
          >
            <Lock size={16} />
            Cambiar contraseña
          </button>
        )}
      </div>

      {exito && (
        <div className="cambio-password__exito">
          <CheckCircle2 size={18} />
          {exito}
        </div>
      )}

      {editando && (
        <form
          className="cambio-password__formulario"
          onSubmit={handleSubmit}
        >

          <label>
            Contraseña actual

            <div className="cambio-password__campo">
              <Lock size={18} />

              <input
                type={mostrarActual ? "text" : "password"}
                value={passwordActual}
                onChange={(event) =>
                  setPasswordActual(event.target.value)
                }
                required
              />

              <button
                type="button"
                className="cambio-password__ver"
                onMouseDown={() => setMostrarActual(true)}
                onMouseUp={() => setMostrarActual(false)}
                onMouseLeave={() => setMostrarActual(false)}
                onTouchStart={() => setMostrarActual(true)}
                onTouchEnd={() => setMostrarActual(false)}
              >
                <Eye size={18} />
              </button>
            </div>
          </label>

          <label>
            Nueva contraseña

            <div className="cambio-password__campo">
              <Lock size={18} />

              <input
                type={mostrarNueva ? "text" : "password"}
                value={passwordNueva}
                onChange={(event) =>
                  setPasswordNueva(event.target.value)
                }
                placeholder="Mínimo 8 caracteres"
                required
              />

              <button
                type="button"
                className="cambio-password__ver"
                onMouseDown={() => setMostrarNueva(true)}
                onMouseUp={() => setMostrarNueva(false)}
                onMouseLeave={() => setMostrarNueva(false)}
                onTouchStart={() => setMostrarNueva(true)}
                onTouchEnd={() => setMostrarNueva(false)}
              >
                <Eye size={18} />
              </button>
            </div>
          </label>

          <label>
            Repetir nueva contraseña

            <div className="cambio-password__campo">
              <Lock size={18} />

              <input
                type={mostrarRepetir ? "text" : "password"}
                value={repetirPassword}
                onChange={(event) =>
                  setRepetirPassword(event.target.value)
                }
                required
              />

              <button
                type="button"
                className="cambio-password__ver"
                onMouseDown={() => setMostrarRepetir(true)}
                onMouseUp={() => setMostrarRepetir(false)}
                onMouseLeave={() => setMostrarRepetir(false)}
                onTouchStart={() => setMostrarRepetir(true)}
                onTouchEnd={() => setMostrarRepetir(false)}
              >
                <Eye size={18} />
              </button>
            </div>
          </label>

          {error && (
            <div className="cambio-password__error">
              <CircleAlert size={18} />
              {error}
            </div>
          )}

          <div className="cambio-password__acciones">

            <button
              type="button"
              className="cambio-password__cancelar"
              onClick={cancelar}
              disabled={guardando}
            >
              <X size={17} />
              Cancelar
            </button>

            <button
              type="submit"
              className="cambio-password__guardar"
              disabled={guardando}
            >
              <Lock size={17} />

              {guardando
                ? "Actualizando..."
                : "Actualizar contraseña"}
            </button>

          </div>

        </form>
      )}

    </section>
  );
}

export default CambioPassword;