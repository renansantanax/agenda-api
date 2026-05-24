import type { Request, Response } from "express";
import * as appointmentsService from "./appointments.service.js";

export async function handleGetAll(req: Request, res: Response) {
  try {
    const appointment = await appointmentsService.getAllAppointments();
    res.status(200).json(appointment);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Erro interno",
    });
  }
}

export async function handleGetById(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!id || typeof id !== "number") {
    return res.status(400).json({ message: "Id é obrigatório" });
  }
  try {
    const appointment = await appointmentsService.getAppointmentById(id);

    res.status(200).json(appointment);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro interno",
    });
  }
}

export async function handleCreateAppointment(req: Request, res: Response) {
  try {
    const appointment = await appointmentsService.createAppointment({
      ...req.body,
      userId: req.user!.id,
    });
    res.status(201).json({
      message: "Agendamento criado com sucesso",
      appointment,
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro interno",
    });
  }
}

export async function handleUpdateAppointment(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!id || typeof id !== "number") {
    return res.status(400).json({ message: "Id é obrigatório" });
  }

  try {
    const updatedAppointment = await appointmentsService.updateAppointment(
      id,
      req.body,
    );
    res.status(200).json(updatedAppointment);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro interno",
    });
  }
}

export async function handleDeleteAppointment(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!id || typeof id !== "number") {
    return res.status(400).json({ message: "Id é obrigatório" });
  }

  try {
    const deactivateClient = await appointmentsService.deleteAppointment(id);
    res.status(200).json({
      message: "Agendamento excluído com sucesso!",
      deactivateClient,
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro interno",
    });
  }
}
