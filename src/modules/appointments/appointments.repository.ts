import { prisma } from "../../lib/prisma.js";

export async function findAll() {
  return prisma.appointment.findMany();
}

export async function findById(id: number) {
  return prisma.appointment.findUnique({
    where: {
      id,
    },
  });
}

export async function create(appointment: {
  date: Date;
  description?: string;
  userId: string;
  clientId: number;
}) {
  return prisma.appointment.create({
    data: {
      date: appointment.date,
      userId: appointment.userId,
      clientId: appointment.clientId,
      ...(appointment.description && {
        description: appointment.description,
      }),
    },
  });
}

async function update(
  id: number,
  data: {
    date?: Date;
    description?: string;
    status?: "PENDING" | "DONE" | "CANCELLED";
  },
) {
  return prisma.appointment.update({
    where: { id },
    data,
    select: {
      id: true,
      date: true,
      description: true,
      status: true,
      user: { select: { id: true, name: true } },
      client: { select: { id: true, name: true, phone: true } },
    },
  });
}

export async function remove(id: number) {
  return prisma.appointment.delete({
    where: { id },
  });
}
