import * as usersService from "./users.service.js";
import type { Request, Response } from "express";

async function handleGetAll(req: Request, res: Response) {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Erro interno",
    });
  }
}

async function handleGetById(req: Request, res: Response) {
  const id = req.params.id;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Id é obrigatório" });
  }
  try {
    const user = await usersService.getUserById(id);

    res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro interno",
    });
  }
}

async function handleCreateUser(req: Request, res: Response) {
  try {
    const user = await usersService.createUser(req.body);
    res.status(201).json({
      message: "Usuário criado com sucesso",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro interno",
    });
  }
}

async function handleUpdateUser(req: Request, res: Response) {
  const id = req.params.id;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Id é obrigatório" });
  }

  try {
    const updatedUser = await usersService.updateUser(id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro interno",
    });
  }
}

async function handleDeleteUser(req: Request, res: Response) {
  const id = req.params.id;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Id é obrigatório" });
  }

  try {
    await usersService.deleteUser(id);
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro interno",
    });
  }
}
export {
  handleGetAll,
  handleGetById,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
};
