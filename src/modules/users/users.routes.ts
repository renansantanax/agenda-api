import { Router } from "express";
import * as usersController from "./users.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createUserSchema } from "./schemas/create-user.schema.js";
import { updateUserSchema } from "./schemas/update-user.schema.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/", validate(createUserSchema), usersController.handleCreateUser);
router.get("/", isAuthenticated, usersController.handleGetAll);
router.get("/:id", usersController.handleGetById);
router.put(
  "/:id",
  validate(updateUserSchema),
  usersController.handleUpdateUser,
);
router.delete("/:id", usersController.handleDeleteUser);

export { router as usersRoutes };
