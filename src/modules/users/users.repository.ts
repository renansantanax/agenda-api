import { prisma } from "../../lib/prisma.js";
import type { CreateUserDTO } from "./dtos/create-user.dto.js";
import type { UpdateUserDto } from "./dtos/update-user.dto.js";

async function getAll() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
}

async function create(user: CreateUserDTO) {
  return prisma.user.create({
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
}

async function update(id: string, user: UpdateUserDto) {
  const data: any = {};

  if (user.name) data.name = user.name;
  if (user.email) data.email = user.email;
  if (user.password) data.password = user.password;

  return prisma.user.update({
    where: {
      id,
    },
    data,
  });
}

async function findByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async function findById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
}

export { create, update, findByEmail, findById, getAll };
