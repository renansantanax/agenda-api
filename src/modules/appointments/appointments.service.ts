import * as appointmentsRepository from "./appointments.repository.js";
import * as clientsRepository from "../clients/clients.repository.js";
import type {
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "./appointments.schema.js";

export async function getAllAppointments() {
  return await appointmentsRepository.findAll();
}

export async function getAppointmentById(id: number) {
  const appointmentExists = await appointmentsRepository.findById(id);

  if (!appointmentExists) {
    throw new Error("Agendamento não encontrado.");
  }

  return appointmentsRepository.findById(id);
}

export async function createAppointment(
  data: CreateAppointmentDTO & { userId: string },
) {
  const clientExists = await clientsRepository.findById(data.clientId);

  if (!clientExists) {
    throw new Error("Cliente não encontrado.");
  }

  if (!clientExists.active) {
    throw new Error("Cliente está desativado.");
  }

  return appointmentsRepository.create(data);
}

export async function updateAppointment(
  id: number,
  appointment: UpdateAppointmentDTO,
) {
  const appointmentExists = await appointmentsRepository.findById(id);

  if (!appointmentExists) {
    throw new Error("Agendamento não encontrado");
  }

  const data: {
    date?: Date;
    description?: string;
    status?: "PENDING" | "DONE" | "CANCELLED";
  } = {
    ...(appointment.date && { date: appointment.date }),
    ...(appointment.description && { description: appointment.description }),
    ...(appointment.status && { status: appointment.status }),
  };

  return appointmentsRepository.update(id, data);
}

export async function deleteAppointment(id: number) {
  const appointmentExists = await appointmentsRepository.findById(id);

  if (!appointmentExists) {
    throw new Error("Agendamento não encontrado para deletar.");
  }

  return appointmentsRepository.remove(id);
}
