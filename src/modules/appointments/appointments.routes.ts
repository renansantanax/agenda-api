import { Router } from "express";
import * as appointmentController from "./appointments.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from "./appointments.schema.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  validate(createAppointmentSchema),
  appointmentController.handleCreateAppointment,
);
router.get("/", isAuthenticated, appointmentController.handleGetAll);
router.get("/:id", isAuthenticated, appointmentController.handleGetById);
router.put(
  "/:id",
  isAuthenticated,
  validate(updateAppointmentSchema),
  appointmentController.handleUpdateAppointment,
);
router.delete(
  "/:id",
  isAuthenticated,
  appointmentController.handleDeleteAppointment,
);

export { router as appointmentsRoutes };
