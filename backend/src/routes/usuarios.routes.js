import { Router } from "express";

import {
    listarUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    obtenerRolesUsuario,
    asignarRolUsuario,
} from "../controllers/usuarios.controller.js";

const router = Router();

router.get("/", listarUsuarios);
router.post("/", crearUsuario);

router.get("/:id/roles", obtenerRolesUsuario);
router.post("/:id/roles", asignarRolUsuario);

router.get("/:id", obtenerUsuarioPorId);

export default router;