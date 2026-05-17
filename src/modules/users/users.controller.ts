import * as usersService from "./users.service.js";
import type { CreateUserDTO } from "./dtos/create-user.dto.js";
import type { UpdateUserDto } from "./dtos/update-user.dto.js";
import type { Request, Response } from "express";

interface Params {
  id: string;
}

async function getAll(req: Request, res: Response) {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Erro interno",
    });
  }
}

async function create(req: Request, res: Response) {
  try {
    const dto: CreateUserDTO = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const user = await usersService.createUser(dto);
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

async function update(req: Request<Params>, res: Response) {
  try {
    const id = req.params.id;

    const dto: UpdateUserDto = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const updatedUser = await usersService.updateUser(id, dto);

    res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro interno",
    });
  }
}

export { create, update, getAll };
