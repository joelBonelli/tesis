import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  ArrowRight,
} from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { verificarEmail } from "../services/authService.js";

import "./VerificarEmail.css";

function VerificarEmail() {
  const [searchParams] = useSearchParams();

  const [estado, setEstado] = useState("cargando");
  const [mensaje, setMensaje] = useState(
    "Estamos verificando tu correo..."
  );

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
        setEstado("error");
        setMensaje(error.message);
      }
    }

    confirmarEmail();
  }, [searchParams]);

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

          {estado === "error" && (
            <div className="verificar-email__icono verificar-email__icono--error">
              <CircleAlert size={38} />
            </div>
          )}

          <h1>
            {estado === "cargando" && "Verificando correo"}
            {estado === "exito" && "¡Cuenta verificada!"}
            {estado === "error" && "No pudimos verificar tu cuenta"}
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

        </section>
      </main>

      <Footer />
    </>
  );
}

export default VerificarEmail;