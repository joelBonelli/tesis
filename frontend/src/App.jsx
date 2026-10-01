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
      </Routes>
    </BrowserRouter>
  );
}

export default App;