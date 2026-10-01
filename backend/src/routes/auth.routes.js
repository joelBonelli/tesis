import { Router } from "express";
import uploadImagen from "../middlewares/uploadImagen.js";
import {
  login,
  obtenerPerfil,
  verificarEmail,
  reenviarVerificacion,
  solicitarRecuperacionPassword,
  restablecerPassword,
  actualizarPerfil,
  cambiarPassword,
  actualizarFotoPerfil,
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
router.patch("/perfil", autenticar, actualizarPerfil);
router.patch(
    "/perfil/password",
    autenticar,
    cambiarPassword
);
router.post(
    "/perfil/foto",
    autenticar,
    uploadImagen.single("foto"),
    actualizarFotoPerfil
);

export default router;