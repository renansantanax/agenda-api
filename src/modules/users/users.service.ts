import bcrypt from "bcryptjs";
import { create } from "./users.repository.js";
import { prisma } from "../../lib/prisma.js";
import "dotenv/config";

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}
async function createUser(user: CreateUserDTO) {
  if (!user.name || !user.email || !user.password) {
    throw new Error("Nome, email e senha são obrigatórios");
  }

  const userExists = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });

  if (userExists) {
    throw new Error("Já existe um usuário cadastrado com esse email");
  }

  const encryptedPassword = await bcrypt.hash(user.password, 10);

  const newUser = {
    name: user.name,
    email: user.email,
    password: encryptedPassword,
  };

  return await create(newUser);
}
