import User from "../entities/User";
import AppDataSource from "../database/data-source";

const userRepository = AppDataSource.getRepository(User);

export const getUserByUsername = async (username: string) => {
  return await userRepository.findOneBy({ username });
};

export const getUserByIp = async (ip: string) => {
  return await userRepository.findOneBy({ ip });
};

export const getUserById = async (id: string) => {
  return await userRepository.findOneBy({ id });
};

export const getAllUsers = async () => {
  return await userRepository.find({
    select: {
      id: true,
      username: true,
      role: true,
      name: true,
      ip: true,
      limit: true,
      status: true,
      lastAccessTime: true,
    },
    order: {
      ip: "ASC",
    },
  });
};

export const createNewUser = async (
  username: string,
  password: string,
  name: string,
  ip: string
) => {
  const newUser = userRepository.create({ username, password, name, ip });
  return await userRepository.manager.transaction(async (manager) => {
    return await manager.save(newUser);
  });
};

export const updateUser = async (
  id: string,
  username: string,
  name: string,
  ip: string,
  limit: number
) => {
  const user = await getUserById(id);
  if (!user) {
    return null;
  }

  user.username = username;
  user.name = name;
  user.ip = ip;
  user.limit = limit;

  return await userRepository.manager.transaction(async (manager) => {
    return await manager.save(user);
  });
};

export const deleteUser = async (id: string) => {
  const user = await getUserById(id);
  if (!user) {
    return null;
  }

  return await userRepository.manager.transaction(async (manager) => {
    return await manager.remove(user);
  });
};

export const updateUserLastAccessTime = async (
  id: string,
  lastAccessTime: Date
) => {
  const user = await getUserById(id);
  if (!user) {
    return null;
  }
  user.lastAccessTime = lastAccessTime;
  user.status = true;

  return await userRepository.manager.transaction(async (manager) => {
    return await manager.save(user);
  });
};

export const updateUserStatus = async (id: string, status: boolean) => {
  const user = await getUserById(id);
  if (!user) {
    return null;
  }
  user.status = status;

  return await userRepository.manager.transaction(async (manager) => {
    return await manager.save(user);
  });
};
