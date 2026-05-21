import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies?.user;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token de autenticação ausente ou inválido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as unknown as {
      id: string;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token de autenticação inválido" });
  }
}
