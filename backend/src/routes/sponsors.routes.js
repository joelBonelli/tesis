import { Router } from "express";

import {
  crearSponsor,
  obtenerMisSponsors,
  solicitarPatrocinio,
  obtenerPatrociniosSponsor,
  resolverPatrocinio,
  verificarSponsor,
  obtenerMisPatrocinios,
} from "../controllers/sponsors.controller.js";

import { autenticar } from "../middlewares/autenticacion.js";
import { autorizarRoles } from "../middlewares/autorizacion.js";

const router = Router();

router.post(
  "/",
  autenticar,
  crearSponsor
);

router.get(
  "/mios",
  autenticar,
  obtenerMisSponsors
);

router.post(
  "/:id/patrocinios",
  autenticar,
  autorizarRoles("TRABAJADOR"),
  solicitarPatrocinio
);

router.get(
  "/:id/patrocinios",
  autenticar,
  obtenerPatrociniosSponsor
);

router.patch(
  "/:sponsorId/patrocinios/:patrocinioId",
  autenticar,
  resolverPatrocinio
);
router.patch(
  "/:id/verificar",
  autenticar,
  autorizarRoles("ADMINISTRADOR"),
  verificarSponsor
);

router.get(
  "/mis-patrocinios",
  autenticar,
  autorizarRoles("TRABAJADOR"),
  obtenerMisPatrocinios
);



export default router;