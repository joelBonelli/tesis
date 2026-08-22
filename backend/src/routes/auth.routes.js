import { Router } from "express";

import {
  login,
  obtenerPerfil,
} from "../controllers/auth.controller.js";

import { autenticar } from "../middlewares/autenticacion.js";

const router = Router();

router.post("/login", login);
router.get("/perfil", autenticar, obtenerPerfil);

export default router;