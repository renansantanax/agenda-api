import { prisma } from "../../lib/prisma.js";
import type { CreateUserDTO } from "./dtos/create-user.dto.js";
import type { UpdateUserDto } from "./dtos/update-user.dto.js";

async function create(user: CreateUserDTO) {
  const createdUser = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      password: user.password,
    },

    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return createdUser;
}

async function update(user: UpdateUserDto, id: string) {
  const data: any = {};

  if (user.name) data.name = user.name;
  if (user.email) data.email = user.email;
  if (user.password) data.password = user.password;

  const updateUser = await prisma.user.update({
    where: {
      id,
    },
    data,
  });

  return updateUser;
}

async function findByEmail(email: string) {
  const result = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return result;
}

export { create, update, findByEmail };
