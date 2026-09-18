import { Router } from "express";

import {
  crearSolicitud,
  obtenerMisSolicitudes,
  obtenerSolicitudesCompatibles,
  crearPropuesta,
  obtenerPropuestasSolicitud,
  aceptarPropuesta,
  cancelarSolicitud,
  retirarPropuesta,
} from "../controllers/solicitudes.controller.js";

import { autenticar } from "../middlewares/autenticacion.js";
import { autorizarRoles } from "../middlewares/autorizacion.js";

const router = Router();

router.post(
  "/",
  autenticar,
  autorizarRoles("CLIENTE"),
  crearSolicitud
);

router.get(
  "/mias",
  autenticar,
  autorizarRoles("CLIENTE"),
  obtenerMisSolicitudes
);

router.get(
  "/compatibles",
  autenticar,
  autorizarRoles("TRABAJADOR"),
  obtenerSolicitudesCompatibles
);

router.post(
  "/:id/propuestas",
  autenticar,
  autorizarRoles("TRABAJADOR"),
  crearPropuesta
);

router.get(
  "/:id/propuestas",
  autenticar,
  autorizarRoles("CLIENTE"),
  obtenerPropuestasSolicitud
);

router.patch(
  "/:solicitudId/propuestas/:propuestaId/aceptar",
  autenticar,
  autorizarRoles("CLIENTE"),
  aceptarPropuesta
);

router.patch(
  "/:id/cancelar",
  autenticar,
  autorizarRoles("CLIENTE"),
  cancelarSolicitud
);

router.patch(
  "/:solicitudId/propuestas/:propuestaId/retirar",
  autenticar,
  autorizarRoles("TRABAJADOR"),
  retirarPropuesta
);

export default router;