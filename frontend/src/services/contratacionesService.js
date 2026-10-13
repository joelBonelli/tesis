const API_URL = import.meta.env.VITE_API_URL;

function obtenerToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay una sesión iniciada");
  }

  return token;
}

export async function obtenerMisContrataciones() {
  const token = obtenerToken();

  const respuesta = await fetch(
    `${API_URL}/api/contrataciones/mias`,
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
        "No se pudieron obtener las contrataciones"
    );
  }

  return datos;
}


export async function obtenerContratacionPorId(id) {
  const token = obtenerToken();

  const respuesta = await fetch(
    `${API_URL}/api/contrataciones/${id}`,
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
        "No se pudo obtener la contratación"
    );
  }

  return datos;
}


export async function finalizarContratacion(id) {
  const token = obtenerToken();

  const respuesta = await fetch(
    `${API_URL}/api/contrataciones/${id}/finalizar`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
        "No se pudo finalizar la contratación"
    );
  }

  return datos;
}

export async function cancelarContratacion(id) {
  const token = obtenerToken();

  const respuesta = await fetch(
    `${API_URL}/api/contrataciones/${id}/cancelar`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
        "No se pudo cancelar la contratación"
    );
  }

  return datos;
}