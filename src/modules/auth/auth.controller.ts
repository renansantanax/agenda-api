import * as authService from "./auth.service.js";
import type { Request, Response } from "express";

export async function handleLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios" });
    }

    const result = await authService.login(email, password);
    res.cookie("user", result.token, {
      maxAge: 86400000,
    });
    res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro interno",
    });
  }
}

export async function handleMe(req: Request, res: Response) {
  try {
    const user = await authService.getMe(req.user!.id);

    res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(404).json({
      message: error instanceof Error ? error.message : "Erro interno",
    });
  }
}

export async function handleLogout(req: Request, res: Response) {
  res.clearCookie("user");
  res.json({ message: "Usuário deslogado com sucesso." });
}
