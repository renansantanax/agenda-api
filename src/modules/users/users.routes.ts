import { Router } from "express";
import { create, update, getAll } from "./users.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createUserSchema } from "./schemas/create-user.schema.js";

const router = Router();

router.get("/", getAll);
router.post("/", validate(createUserSchema), create);
router.put("/:id", update);

export { router as usersRoutes };
