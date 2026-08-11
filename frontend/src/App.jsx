import { useEffect, useState } from "react";

function App() {
  const [mensaje, setMensaje] = useState("Conectando con el backend...");

  useEffect(() => {
    fetch("http://localhost:3000")
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        setMensaje(datos.message);
      })
      .catch((error) => {
        console.error(error);
        setMensaje("No se pudo conectar con el backend");
      });
  }, []);

  return (
    <main>
      <h1>Trabajito</h1>
      <p>{mensaje}</p>
    </main>
  );
}

export default App;