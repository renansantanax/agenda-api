import { prisma } from "../../lib/prisma.js";

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

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

export { create };
