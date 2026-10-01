import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  ArrowRight,
  Mail,
} from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import {
  verificarEmail,
  reenviarVerificacion,
} from "../services/authService.js";

import "./VerificarEmail.css";

function VerificarEmail() {
  const [searchParams] = useSearchParams();

  const [estado, setEstado] = useState("cargando");

  const [mensaje, setMensaje] = useState(
    "Estamos verificando tu correo..."
  );

  const [email, setEmail] = useState("");
  const [reenviando, setReenviando] = useState(false);
  const [reenviado, setReenviado] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");

    async function confirmarEmail() {
      if (!token) {
        setEstado("error");
        setMensaje("El enlace de verificación no es válido.");
        return;
      }

      try {
        const datos = await verificarEmail(token);

        setEstado("exito");
        setMensaje(datos.message);
      } catch (error) {
        if (error.message.toLowerCase().includes("vencido")) {
          setEstado("vencido");

          setMensaje(
            "El enlace de verificación venció. Podés solicitar uno nuevo."
          );

          return;
        }

        setEstado("error");
        setMensaje(error.message);
      }
    }

    confirmarEmail();
  }, [searchParams]);

  async function handleReenviar(event) {
    event.preventDefault();

    if (!email) {
      return;
    }

    setReenviando(true);
    setReenviado(false);

    try {
      await reenviarVerificacion(email);

      setReenviado(true);
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setReenviando(false);
    }
  }

  return (
    <>
      <Header />

      <main className="verificar-email">
        <section className="verificar-email__panel">

          {estado === "cargando" && (
            <div className="verificar-email__icono verificar-email__icono--cargando">
              <LoaderCircle size={38} />
            </div>
          )}

          {estado === "exito" && (
            <div className="verificar-email__icono verificar-email__icono--exito">
              <CheckCircle2 size={38} />
            </div>
          )}

          {(estado === "error" || estado === "vencido") && (
            <div className="verificar-email__icono verificar-email__icono--error">
              <CircleAlert size={38} />
            </div>
          )}

          <h1>
            {estado === "cargando" && "Verificando correo"}

            {estado === "exito" && "¡Cuenta verificada!"}

            {estado === "vencido" && "El enlace venció"}

            {estado === "error" &&
              "No pudimos verificar tu cuenta"}
          </h1>

          <p>{mensaje}</p>

          {estado === "exito" && (
            <Link
              to="/login"
              className="verificar-email__boton"
            >
              Iniciar sesión
              <ArrowRight size={18} />
            </Link>
          )}

          {estado === "vencido" && (
            <form
              className="verificar-email__reenvio"
              onSubmit={handleReenviar}
            >
              {!reenviado ? (
                <>
                  <p>
                    Ingresá el email con el que te registraste y
                    te enviaremos un nuevo enlace.
                  </p>

                  <div className="verificar-email__campo">
                    <Mail size={18} />

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

                  <button
                    type="submit"
                    className="verificar-email__boton"
                    disabled={reenviando}
                  >
                    {reenviando
                      ? "Enviando..."
                      : "Reenviar verificación"}
                  </button>
                </>
              ) : (
                <div className="verificar-email__reenviado">
                  <CheckCircle2 size={22} />

                  <span>
                    Si la cuenta existe y está pendiente de
                    verificación, recibirás un nuevo correo.
                  </span>
                </div>
              )}
            </form>
          )}

          {estado === "error" && (
            <div className="verificar-email__acciones">
              <Link to="/login">
                Volver al login
              </Link>

              <Link to="/registro">
                Crear una cuenta
              </Link>
            </div>
          )}

        </section>
      </main>

      <Footer />
    </>
  );
}

export default VerificarEmail;