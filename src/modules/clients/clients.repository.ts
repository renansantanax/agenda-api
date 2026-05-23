import { prisma } from "../../lib/prisma.js";

export async function findAll() {
  return prisma.client.findMany({
    where: {
      active: true,
    },
  });
}

export async function create(client: { name: string; phone: string }) {
  return prisma.client.create({
    data: {
      name: client.name,
      phone: client.phone,
    },
    select: {
      id: true,
      name: true,
      phone: true,
    },
  });
}

export async function update(
  id: number,
  client: { name?: string; phone?: string },
) {
  return prisma.client.update({
    where: {
      id,
    },
    data: client,
    select: {
      id: true,
      name: true,
      phone: true,
    },
  });
}

export async function findByName(name: string) {
  return prisma.user.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });
}

export async function findById(id: number) {
  return prisma.client.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      active: true,
    },
  });
}

export async function deactivate(id: number) {
  return prisma.client.update({
    where: {
      id: id,
    },
    data: {
      active: false,
    },
  });
}
