const API_URL = import.meta.env.VITE_API_URL;

function obtenerToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay una sesión iniciada");
  }

  return token;
}

export async function obtenerMisSolicitudes() {
  const token = obtenerToken();

  const respuesta = await fetch(
    `${API_URL}/api/solicitudes/mias`,
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
      "No se pudieron obtener tus solicitudes"
    );
  }

  return datos;
}


export async function obtenerDetalleSolicitud(id) {
  const token = obtenerToken();

  const respuesta = await fetch(
    `${API_URL}/api/solicitudes/${id}/propuestas`,
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
      "No se pudo obtener la solicitud"
    );
  }

  return datos;
}

export async function aceptarPropuesta(
  solicitudId,
  propuestaId
) {
  const token = obtenerToken();

  const respuesta = await fetch(
    `${API_URL}/api/solicitudes/${solicitudId}/propuestas/${propuestaId}/aceptar`,
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
      "No se pudo aceptar la propuesta"
    );
  }

  return datos;
}


export async function crearSolicitud(datosSolicitud) {
  const token = obtenerToken();

  const respuesta = await fetch(
    `${API_URL}/api/solicitudes`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(datosSolicitud),
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
      "No se pudo publicar la solicitud"
    );
  }

  return datos;
}


export async function obtenerSolicitudesCompatibles() {
  const token = obtenerToken();

  const respuesta = await fetch(
    `${API_URL}/api/solicitudes/compatibles`,
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
        "No se pudieron obtener las solicitudes disponibles"
    );
  }

  return datos;
}

export async function crearPropuesta(
  solicitudId,
  datosPropuesta
) {
  const token = obtenerToken();

  const respuesta = await fetch(
    `${API_URL}/api/solicitudes/${solicitudId}/propuestas`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(datosPropuesta),
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.message ||
        "No se pudo enviar la propuesta"
    );
  }

  return datos;
}


export async function obtenerMisPropuestas() {
  const token = obtenerToken();

  const respuesta = await fetch(
    `${API_URL}/api/solicitudes/mis-propuestas`,
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
        "No se pudieron obtener tus propuestas"
    );
  }

  return datos;
}