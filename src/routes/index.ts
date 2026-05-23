import { Router } from "express";
import { usersRoutes } from "../modules/users/users.routes.js";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { clientsRoutes } from "../modules/clients/clients.routes.js";

const router = Router();

router.use("/users", usersRoutes);
router.use("/auth", authRoutes);
router.use("/clients", clientsRoutes);

export { router };
