import * as appointmentsRepository from "./appointments.repository.js";
import type {
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "./appointments.schema.js";

export async function getAllAppointments() {
  return await appointmentsRepository.findAll();
}
