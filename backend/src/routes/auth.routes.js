import { Router } from "express";

import {
  login,
  obtenerPerfil,
  verificarEmail,
  reenviarVerificacion,
  solicitarRecuperacionPassword,
  restablecerPassword,
} from "../controllers/auth.controller.js";

import { autenticar } from "../middlewares/autenticacion.js";

const router = Router();

router.post("/login", login);
router.post("/verificar-email", verificarEmail);
router.post("/reenviar-verificacion", reenviarVerificacion);
router.post(
  "/solicitar-recuperacion-password",
  solicitarRecuperacionPassword
);

router.post(
  "/restablecer-password",
  restablecerPassword
);
router.get("/perfil", autenticar, obtenerPerfil);

export default router;