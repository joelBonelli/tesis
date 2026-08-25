import { Router } from "express";

import {
  crearMiPerfilTrabajador,
  obtenerMiPerfilTrabajador,
  actualizarMiPerfilTrabajador,
  pruebaTrabajador,
  obtenerTrabajadorPorId,
  asignarCategoriasMiPerfil,
  obtenerCategoriasMiPerfil,
} from "../controllers/trabajadores.controller.js";

import { autenticar } from "../middlewares/autenticacion.js";
import { autorizarRoles } from "../middlewares/autorizacion.js";

const router = Router();

router.post(
  "/mi-perfil-trabajador",
  autenticar,
  autorizarRoles("TRABAJADOR"),
  crearMiPerfilTrabajador
);

router.get(
  "/mi-perfil-trabajador",
  autenticar,
  autorizarRoles("TRABAJADOR"),
  obtenerMiPerfilTrabajador
);

router.put(
  "/mi-perfil-trabajador",
  autenticar,
  autorizarRoles("TRABAJADOR"),
  actualizarMiPerfilTrabajador
);

router.get(
  "/trabajador/prueba",
  autenticar,
  autorizarRoles("TRABAJADOR"),
  pruebaTrabajador
);

router.get(
  "/trabajadores/:id",
  obtenerTrabajadorPorId
);

router.post(
  "/mi-perfil-trabajador/categorias",
  autenticar,
  autorizarRoles("TRABAJADOR"),
  asignarCategoriasMiPerfil
);

router.get(
  "/mi-perfil-trabajador/categorias",
  autenticar,
  autorizarRoles("TRABAJADOR"),
  obtenerCategoriasMiPerfil
);


export default router;