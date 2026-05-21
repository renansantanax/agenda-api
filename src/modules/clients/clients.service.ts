import * as clientsRepository from "./clients.repository.js";
import type { CreateClientDto, UpdateClientDto } from "./clients.schema.js";

export async function getAllClients() {
  return clientsRepository.findAll();
}

export async function getClientById(id: number) {
  if (!id) {
    throw new Error("Id é obrigatório.");
  }
  const user = await clientsRepository.findById(id);

  if (!user) {
    throw new Error("Nenhum usuário foi encontrado com esse ID.");
  }
  return user;
}

export async function createClient(client: CreateClientDto) {
  const clientExists = await clientsRepository.findByName(client.name);

  if (clientExists) {
    throw new Error("Já existe um cliente cadastrado com esse mesmo nome");
  }

  const newClient = {
    name: client.name,
    phone: client.phone,
  };

  return clientsRepository.create(newClient);
}

export async function updateClient(id: number, user: UpdateClientDto) {
  const userExists = await clientsRepository.findById(id);

  if (!userExists) {
    throw new Error("Usuário não encontrado.");
  }

  const data: { name?: string; phone?: string } = {
    ...(user.name && { name: user.name }),
    ...(user.phone && { phone: user.phone }),
  };

  return clientsRepository.update(id, data);
}
