import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import trabajadoresRoutes from "./routes/trabajadores.routes.js";
import solicitudesRoutes from "./routes/solicitudes.routes.js";
import contratacionesRoutes from "./routes/contrataciones.routes.js";
import sponsorsRoutes from "./routes/sponsors.routes.js";
import notificacionesRoutes from "./routes/notificaciones.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuariosRoutes);
app.use("/api", authRoutes);
app.use("/api", trabajadoresRoutes);
app.use("/api/solicitudes", solicitudesRoutes);
app.use("/api/contrataciones", contratacionesRoutes);
app.use("/api/sponsors", sponsorsRoutes);
app.use("/api/notificaciones", notificacionesRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API de Trabajito funcionando correctamente",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});