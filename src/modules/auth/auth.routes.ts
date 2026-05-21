import { Router } from "express";
import * as authController from "./auth.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
const router = Router();

router.post("/login", authController.handleLogin);
router.post("/logout", isAuthenticated, authController.handleLogout);
router.get("/me", isAuthenticated, authController.handleMe);

export { router as authRoutes };
