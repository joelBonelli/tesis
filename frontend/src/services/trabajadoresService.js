const API_URL = import.meta.env.VITE_API_URL;

function obtenerToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay una sesión iniciada");
  }

  return token;
}

export async function crearMiPerfilTrabajador(datosPerfil) {
  const token = obtenerToken();

  const respuesta = await fetch(
    `${API_URL}/api/mi-perfil-trabajador`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datosPerfil),
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
        "No se pudo crear el perfil profesional"
    );
  }

  return datos;
}

export async function obtenerMiPerfilTrabajador() {
  const token = obtenerToken();

  const respuesta = await fetch(
    `${API_URL}/api/mi-perfil-trabajador`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
        "No se pudo obtener el perfil profesional"
    );
  }

  return datos;
}


export async function actualizarMiPerfilTrabajador(datosPerfil) {
  const token = obtenerToken();

  const respuesta = await fetch(
    `${API_URL}/api/mi-perfil-trabajador`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datosPerfil),
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
        "No se pudo actualizar el perfil profesional"
    );
  }

  return datos;
}


export async function obtenerCategoriasActivas() {
  const token = obtenerToken();

  const respuesta = await fetch(
    `${API_URL}/api/categorias`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
        "No se pudieron obtener las categorías"
    );
  }

  return datos;
}

export async function obtenerCategoriasMiPerfil() {
  const token = obtenerToken();

  const respuesta = await fetch(
    `${API_URL}/api/mi-perfil-trabajador/categorias`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
        "No se pudieron obtener tus categorías"
    );
  }

  return datos;
}

export async function actualizarCategoriasMiPerfil(
  categoriaIds
) {
  const token = obtenerToken();

  const respuesta = await fetch(
    `${API_URL}/api/mi-perfil-trabajador/categorias`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        categoriaIds,
      }),
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
        "No se pudieron actualizar las categorías"
    );
  }

  return datos;
}


export async function obtenerTrabajadorPorId(id) {
  const respuesta = await fetch(
    `${API_URL}/api/trabajadores/${id}`
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
        "No se pudo obtener el perfil del trabajador"
    );
  }

  return datos;
}


export async function obtenerCalificacionesTrabajador(id) {
  const respuesta = await fetch(
    `${API_URL}/api/trabajadores/${id}/calificaciones`
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
        "No se pudieron obtener las calificaciones"
    );
  }

  return datos;
}