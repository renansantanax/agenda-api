import type { Request, Response } from "express";
import * as clientsService from "./clients.service.js";

export async function handleGetAll(req: Request, res: Response) {
  try {
    const clients = await clientsService.getAllClients();
    res.status(200).json(clients);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Erro interno",
    });
  }
}

export async function handleGetById(req: Request, res: Response) {
  const id = req.params.id;

  if (!id || typeof id !== "number") {
    return res.status(400).json({ message: "Id é obrigatório" });
  }
  try {
    const client = await clientsService.getClientById(id);

    res.status(200).json(client);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro interno",
    });
  }
}

export async function handleCreateClient(req: Request, res: Response) {
  try {
    const user = await clientsService.createClient(req.body);
    res.status(201).json({
      message: "Cliente criado com sucesso",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro interno",
    });
  }
}

export async function handleUpdateClient(req: Request, res: Response) {
  const id = req.params.id;

  if (!id || typeof id !== "number") {
    return res.status(400).json({ message: "Id é obrigatório" });
  }

  try {
    const updatedClient = await clientsService.updateClient(id, req.body);
    res.status(200).json(updatedClient);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro interno",
    });
  }
}
