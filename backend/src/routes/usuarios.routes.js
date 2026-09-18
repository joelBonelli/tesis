import { Router } from "express";
import { autenticar } from "../middlewares/autenticacion.js";
import { autorizarRoles } from "../middlewares/autorizacion.js";

import {
    listarUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    obtenerRolesUsuario,
    asignarRolUsuario,
} from "../controllers/usuarios.controller.js";

const router = Router();

router.get(
  "/",
  autenticar,
  autorizarRoles("ADMINISTRADOR"),
  listarUsuarios
);

router.post("/", crearUsuario);

router.get(
  "/:id/roles",
  autenticar,
  autorizarRoles("ADMINISTRADOR"),
  obtenerRolesUsuario
);

router.post(
  "/:id/roles",
  autenticar,
  autorizarRoles("ADMINISTRADOR"),
  asignarRolUsuario
);

router.get(
  "/:id",
  autenticar,
  autorizarRoles("ADMINISTRADOR"),
  obtenerUsuarioPorId
);

export default router;