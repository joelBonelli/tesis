import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  ClipboardList,
  Bell,
  BriefcaseBusiness,
} from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import { obtenerPerfil } from "../services/authService.js";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarPerfil() {
      try {
        const datos = await obtenerPerfil();

        setUsuario(datos);
      } catch (error) {
        setError(error.message);

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } finally {
        setCargando(false);
      }
    }

    cargarPerfil();
  }, [navigate]);

  if (cargando) {
    return (
      <>
        <Header />

        <main className="dashboard dashboard--estado">
          <p>Cargando tu cuenta...</p>
        </main>

        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />

        <main className="dashboard dashboard--estado">
          <p>{error}</p>
        </main>

        <Footer />
      </>
    );
  }

  const roles = usuario.roles.map((rol) => rol.nombre);

  const esCliente = roles.includes("CLIENTE");
  const esTrabajador = roles.includes("TRABAJADOR");

  return (
    <>
      <Header />

      <main className="dashboard">
        <div className="dashboard__contenido">

          <section className="dashboard__bienvenida">
            <span>Mi cuenta</span>

            <h1>
              Hola, {usuario.nombre}
            </h1>

            <p>
              Desde acá podés gestionar tu actividad en Al Rescate.
            </p>

            <div className="dashboard__roles">
              {roles.map((rol) => (
                <span key={rol}>
                  {rol}
                </span>
              ))}
            </div>
          </section>

          <section className="dashboard__opciones">

            <button
                className="dashboard-card"
                onClick={() => navigate("/perfil")}
            >
              <div className="dashboard-card__icono">
                <User size={26} />
              </div>

              <div>
                <h2>Mi perfil</h2>
                <p>
                  Consultá y modificá tus datos personales.
                </p>
              </div>
            </button>

            {esCliente && (
              <button className="dashboard-card">
                <div className="dashboard-card__icono">
                  <ClipboardList size={26} />
                </div>

                <div>
                  <h2>Mis solicitudes</h2>
                  <p>
                    Administrá los servicios que necesitás.
                  </p>
                </div>
              </button>
            )}

            {esTrabajador && (
              <button className="dashboard-card">
                <div className="dashboard-card__icono">
                  <BriefcaseBusiness size={26} />
                </div>

                <div>
                  <h2>Mi trabajo</h2>
                  <p>
                    Revisá propuestas y oportunidades.
                  </p>
                </div>
              </button>
            )}

            <button className="dashboard-card">
              <div className="dashboard-card__icono">
                <Bell size={26} />
              </div>

              <div>
                <h2>Notificaciones</h2>
                <p>
                  Revisá las novedades de tu cuenta.
                </p>
              </div>
            </button>

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Dashboard;