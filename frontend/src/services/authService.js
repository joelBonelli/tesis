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


export async function reenviarVerificacion(email) {
  const respuesta = await fetch(
    `${API_URL}/api/reenviar-verificacion`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message || "No se pudo reenviar el correo"
    );
  }

  return datos;
}


export async function solicitarRecuperacionPassword(email) {
  const respuesta = await fetch(
    `${API_URL}/api/solicitar-recuperacion-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
        "No se pudo solicitar la recuperación de contraseña"
    );
  }

  return datos;
}


export async function restablecerPassword(token, password) {
  const respuesta = await fetch(
    `${API_URL}/api/restablecer-password`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        token,
        password,
      }),
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message || "No se pudo restablecer la contraseña"
    );
  }

  return datos;
}


export async function obtenerPerfil() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay una sesión iniciada");
  }

  const respuesta = await fetch(`${API_URL}/api/perfil`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message || "No se pudo obtener el perfil"
    );
  }

  return datos;
}


export async function actualizarPerfil(datosPerfil) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay una sesión iniciada");
  }

  const respuesta = await fetch(`${API_URL}/api/perfil`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(datosPerfil),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message || "No se pudo actualizar el perfil"
    );
  }

  return datos;
}


export async function cambiarPassword(
  passwordActual,
  passwordNueva
) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay una sesión iniciada");
  }

  const respuesta = await fetch(
    `${API_URL}/api/perfil/password`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        passwordActual,
        passwordNueva,
      }),
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message || "No se pudo cambiar la contraseña"
    );
  }

  return datos;
}


export async function actualizarFotoPerfil(archivo) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay una sesión iniciada");
  }

  const formData = new FormData();

  formData.append("foto", archivo);

  const respuesta = await fetch(
    `${API_URL}/api/perfil/foto`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: formData,
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message || "No se pudo actualizar la foto"
    );
  }

  return datos;
}