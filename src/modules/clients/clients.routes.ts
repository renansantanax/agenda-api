import { Router } from "express";
import * as clientController from "./clients.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createClientSchema, updateClientSchema } from "./clients.schema.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/",
  validate(createClientSchema),
  isAuthenticated,
  clientController.handleCreateClient,
);
router.get("/", isAuthenticated, clientController.handleGetAll);
router.get("/:id", isAuthenticated, clientController.handleGetById);
router.put(
  "/:id",
  isAuthenticated,
  validate(updateClientSchema),
  clientController.handleUpdateClient,
);
router.delete("/:id", isAuthenticated, clientController.handleDeactivateClient);

export { router as clientsRoutes };
