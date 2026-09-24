const API_URL = import.meta.env.VITE_API_URL;

export async function iniciarSesion(email, password) {
  const respuesta = await fetch(`${API_URL}/api/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      password,
    }),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.message || "No se pudo iniciar sesión");
  }

  return datos;
}


export async function registrarUsuario(datosUsuario) {
  const respuesta = await fetch(`${API_URL}/api/usuarios`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(datosUsuario),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.message || "No se pudo crear la cuenta");
  }

  return datos;
}


export async function verificarEmail(token) {
  const respuesta = await fetch(`${API_URL}/api/verificar-email`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      token,
    }),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message || "No se pudo verificar el correo"
    );
  }

  return datos;
}