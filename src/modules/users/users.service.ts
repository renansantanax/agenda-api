import bcrypt from "bcryptjs";
import { create, findByEmail } from "./users.repository.js";
import type { CreateUserDTO } from "./dtos/create-user.dto.js";

async function createUser(user: CreateUserDTO) {
  if (!user.name || !user.email || !user.password) {
    throw new Error("Nome, email e senha são obrigatórios");
  }

  const userExists = await findByEmail(user.email);

  if (userExists) {
    throw new Error("Já existe um usuário cadastrado com esse email");
  }

  const encryptedPassword = await bcrypt.hash(user.password, 10);

  const newUser = {
    name: user.name,
    email: user.email,
    password: encryptedPassword,
  };

  return create(newUser);
}

export { createUser };
