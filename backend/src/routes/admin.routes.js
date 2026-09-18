import { Router } from "express";

import {
  obtenerSponsorsPendientes,
  cambiarEstadoUsuario,
  cambiarEstadoSponsor,
} from "../controllers/admin.controller.js";

import { autenticar } from "../middlewares/autenticacion.js";
import { autorizarRoles } from "../middlewares/autorizacion.js";

const router = Router();

router.get(
  "/sponsors/pendientes",
  autenticar,
  autorizarRoles("ADMINISTRADOR"),
  obtenerSponsorsPendientes
);

router.patch(
  "/usuarios/:id/estado",
  autenticar,
  autorizarRoles("ADMINISTRADOR"),
  cambiarEstadoUsuario
);

router.patch(
  "/sponsors/:id/estado",
  autenticar,
  autorizarRoles("ADMINISTRADOR"),
  cambiarEstadoSponsor
);


export default router;