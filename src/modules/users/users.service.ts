import bcrypt from "bcryptjs";
import * as usersRepository from "./users.repository.js";
import type { UpdateUserDto, CreateUserDto } from "./users.schema.js";

async function getAllUsers() {
  return usersRepository.findAll();
}

async function getUserById(id: string) {
  if (!id) {
    throw new Error("Id é obrigatório.");
  }
  const user = await usersRepository.findById(id);

  if (!user) {
    throw new Error("Nenhum usuário foi encontrado com esse ID.");
  }

  return user;
}

async function createUser(user: CreateUserDto) {
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
  const userExists = await usersRepository.findById(id);

  if (!userExists) {
    throw new Error("Usuário não encontrado.");
  }

  const data: { name?: string; email?: string; password?: string } = {
    ...(user.name && { name: user.name }),
    ...(user.email && { email: user.email }),
  };

  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }

  return usersRepository.update(id, data);
}

async function deleteUser(id: string) {
  const userExists = await usersRepository.findById(id);
  if (!userExists) {
    throw new Error("Usuário não encontrado.");
  }
  return usersRepository.remove(id);
}

export { createUser, updateUser, getAllUsers, getUserById, deleteUser };
