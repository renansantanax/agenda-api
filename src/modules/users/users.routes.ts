import { Router } from "express";

import { create } from "./users.controller.js";

const router = Router();

router.post("/", create);

export { router as usersRoutes };
