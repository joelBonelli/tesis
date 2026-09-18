import { Router } from "express";

import {
  obtenerMisNotificaciones,
  marcarNotificacionComoLeida,
  marcarTodasComoLeidas,
} from "../controllers/notificaciones.controller.js";

import { autenticar } from "../middlewares/autenticacion.js";

const router = Router();

router.get(
  "/",
  autenticar,
  obtenerMisNotificaciones
);

router.patch(
  "/todas/leidas",
  autenticar,
  marcarTodasComoLeidas
);

router.patch(
  "/:id/leida",
  autenticar,
  marcarNotificacionComoLeida
);

export default router;