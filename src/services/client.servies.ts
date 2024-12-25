import AppDataSource from "../database/data-source";
import Client from "../entities/Client";

const clientRepository = AppDataSource.getRepository(Client);

export const getClients = async () => {
  return await clientRepository.find({ order: { ip: "ASC" } });
};

export const getClientById = async (id: string) => {
  return await clientRepository.findOneBy({ id });
};

export const createNewClient = async (
  name: string,
  ip: string,
  userId: string
) => {
  const newClient = clientRepository.create({
    name,
    ip,
    createdBy: userId,
    updatedBy: userId,
  });
  return await clientRepository.manager.transaction(async (manager) => {
    return await manager.save(newClient);
  });
};

export const updateClient = async (
  id: string,
  name: string,
  ip: string,
  limit: number,
  userId: string
) => {
  const client = await getClientById(id);
  if (!client) {
    return null;
  }
  client.name = name;
  client.ip = ip;
  client.limit = limit;
  client.updatedBy = userId;

  return await clientRepository.manager.transaction(async (manager) => {
    return await manager.save(client);
  });
};

export const deleteClient = async (id: string) => {
  const client = await getClientById(id);
  if (!client) {
    return null;
  }

  return await clientRepository.manager.transaction(async (manager) => {
    return await manager.remove(client);
  });
};

export const updateClientLastAccessTime = async (
  id: string,
  lastAccessTime: Date
) => {
  const client = await getClientById(id);
  if (!client) {
    return null;
  }
  client.lastAccessTime = lastAccessTime;
  client.status = true;

  return await clientRepository.manager.transaction(async (manager) => {
    return await manager.save(client);
  });
};

export const updateClientStatus = async (id: string, status: boolean) => {
  const client = await getClientById(id);
  if (!client) {
    return null;
  }
  client.status = status;

  return await clientRepository.manager.transaction(async (manager) => {
    return await manager.save(client);
  });
};
