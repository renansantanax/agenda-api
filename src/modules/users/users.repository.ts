import { prisma } from "../../lib/prisma.js";
import type { CreateUserDTO } from "./dtos/create-user.dto.js";
import type { UpdateUserDto } from "./dtos/update-user.dto.js";

async function findAll() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
}

async function create(user: { name: string; email: string; password: string }) {
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

async function update(
  id: string,
  user: { name?: string; email?: string; password?: string },
) {
  return prisma.user.update({
    where: {
      id,
    },
    data: user,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
}

async function remove(id: string) {
  return prisma.user.delete({
    where: {
      id,
    },
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

export { create, update, findByEmail, findById, findAll, remove };
