import { Router } from "express";

import {
  obtenerMisContrataciones,
  finalizarContratacion,
  calificarContratacion,
  cancelarContratacion,
} from "../controllers/contrataciones.controller.js";

import {
  enviarMensaje,
  obtenerMensajes,
  marcarMensajesComoLeidos,
} from "../controllers/chat.controller.js";

import { autenticar } from "../middlewares/autenticacion.js";
import { autorizarRoles } from "../middlewares/autorizacion.js";

const router = Router();

router.get(
  "/mias",
  autenticar,
  autorizarRoles("CLIENTE", "TRABAJADOR"),
  obtenerMisContrataciones
);

router.patch(
  "/:id/finalizar",
  autenticar,
  autorizarRoles("CLIENTE"),
  finalizarContratacion
);

router.post(
  "/:id/calificacion",
  autenticar,
  autorizarRoles("CLIENTE"),
  calificarContratacion
);


router.post(
  "/:id/mensajes",
  autenticar,
  autorizarRoles("CLIENTE", "TRABAJADOR"),
  enviarMensaje
);

router.get(
  "/:id/mensajes",
  autenticar,
  autorizarRoles("CLIENTE", "TRABAJADOR"),
  obtenerMensajes
);

router.patch(
  "/:id/mensajes/leidos",
  autenticar,
  autorizarRoles("CLIENTE", "TRABAJADOR"),
  marcarMensajesComoLeidos
);

router.patch(
  "/:id/cancelar",
  autenticar,
  autorizarRoles("CLIENTE", "TRABAJADOR"),
  cancelarContratacion
);

export default router;