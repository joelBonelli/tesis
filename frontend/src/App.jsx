import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inicio from "./pages/Inicio.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import VerificarEmail from "./pages/VerificarEmail.jsx";
import RecuperarPassword from "./pages/RecuperarPassword.jsx";
import RestablecerPassword from "./pages/RestablecerPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import RutaProtegida from "./components/RutaProtegida.jsx";
import Perfil from "./pages/Perfil.jsx";
import TrabajadorPublico from "./pages/TrabajadorPublico.jsx";
import MisSolicitudes from "./pages/MisSolicitudes.jsx";
import DetalleSolicitud from "./pages/DetalleSolicitud.jsx";
import NuevaSolicitud from "./pages/NuevaSolicitud.jsx";
import Trabajo from "./pages/Trabajo.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/verificar-email"
          element={<VerificarEmail />}
        />
        <Route
          path="/recuperar-password"
          element={<RecuperarPassword />}
        />
        <Route
          path="/restablecer-password"
          element={<RestablecerPassword />}
        />
        <Route
          path="/dashboard"
          element={
            <RutaProtegida>
              <Dashboard />
            </RutaProtegida>
          }
        />
        <Route
          path="/perfil"
          element={
            <RutaProtegida>
              <Perfil />
            </RutaProtegida>
          }
        />
        <Route
          path="/trabajadores/:id"
          element={<TrabajadorPublico />}
        />
        <Route
          path="/solicitudes"
          element={
            <RutaProtegida>
              <MisSolicitudes />
            </RutaProtegida>
          }
        />
        <Route
          path="/solicitudes/:id"
          element={
            <RutaProtegida>
              <DetalleSolicitud />
            </RutaProtegida>
          }
        />
        <Route
          path="/solicitudes/nueva"
          element={
            <RutaProtegida>
              <NuevaSolicitud />
            </RutaProtegida>
          }
        />
        <Route
          path="/trabajo"
          element={
            <RutaProtegida>
              <Trabajo />
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;