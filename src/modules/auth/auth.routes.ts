import { Router } from "express";
import * as authController from "./auth.controller.js";
const router = Router();

router.post("/login", authController.handleLogin);

export { router as authRoutes };
