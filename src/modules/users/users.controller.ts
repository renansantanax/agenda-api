import { createUser } from "./users.service.js";
import type { CreateUserDTO } from "./dtos/create-user.dto.js";
import type { Request, Response } from "express";

async function create(req: Request, res: Response) {
  try {
    const dto: CreateUserDTO = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const user = await createUser(dto);
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

export { create };
