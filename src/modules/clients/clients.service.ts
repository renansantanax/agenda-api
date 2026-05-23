import * as clientsRepository from "./clients.repository.js";
import type { CreateClientDto, UpdateClientDto } from "./clients.schema.js";

export async function getAllClients() {
  return clientsRepository.findAll();
}

export async function getClientById(id: number) {
  if (!id) {
    throw new Error("Id é obrigatório.");
  }
  const client = await clientsRepository.findById(id);

  if (!client) {
    throw new Error("Nenhum usuário foi encontrado com esse ID.");
  }
  return client;
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
  const clientExists = await clientsRepository.findById(id);

  if (!clientExists) {
    throw new Error("Usuário não encontrado.");
  }

  const data: { name?: string; phone?: string } = {
    ...(user.name && { name: user.name }),
    ...(user.phone && { phone: user.phone }),
  };

  return clientsRepository.update(id, data);
}

export async function deactivateClient(id: number) {
  const clientExists = await clientsRepository.findById(id);

  if (!clientExists) {
    throw new Error("Cliente não encontrado.");
  }

  if (!clientExists.active) {
    throw new Error("Cliente já está desativado");
  }

  return clientsRepository.deactivate(id);
}
