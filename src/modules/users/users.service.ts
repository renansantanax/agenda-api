import bcrypt from "bcryptjs";
import * as usersRepository from "./users.repository.js";
import type { CreateUserDTO } from "./dtos/create-user.dto.js";
import type { UpdateUserDto } from "./dtos/update-user.dto.js";

async function getAllUsers() {
  return usersRepository.getAll();
}

async function getUser(id: string) {
  if (!id) {
    throw new Error("Id é obrigatório.");
  }
  const user = await usersRepository.getById(id);

  if (!user) {
    throw new Error("Nenhum usuário foi encontrado com esse ID.");
  }

  return user;
}

async function createUser(user: CreateUserDTO) {
  const userExists = await usersRepository.findByEmail(user.email);

  if (userExists) {
    throw new Error("Já existe um usuário cadastrado com esse email");
  }

  const encryptedPassword = await bcrypt.hash(user.password, 10);

  const newUser = {
    name: user.name,
    email: user.email,
    password: encryptedPassword,
  };

  return usersRepository.create(newUser);
}

async function updateUser(id: string, user: UpdateUserDto) {
  if (!id) {
    throw new Error("id é obrigatório");
  }

  const userExists = await usersRepository.findById(id);

  if (!userExists) {
    throw new Error("Usuário não encontrado.");
  }

  if (!user.name && !user.email && !user.password) {
    throw new Error("Nenhum dado informado para atualização");
  }

  const data: UpdateUserDto = {
    ...(user.name && { name: user.name }),
    ...(user.email && { email: user.email }),
  };

  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }

  return usersRepository.update(id, data);
}

export { createUser, updateUser, getAllUsers };
