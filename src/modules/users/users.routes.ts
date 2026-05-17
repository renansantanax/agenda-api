import { Router } from "express";

import { create, update, getAll } from "./users.controller.js";

const router = Router();

router.get("/", getAll);
router.post("/", create);
router.put("/:id", update);

export { router as usersRoutes };
