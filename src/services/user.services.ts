import User from "../entities/User";
import AppDataSource from "../database/data-source";
import { UserRole } from "../utils/type";

const userRepository = AppDataSource.getRepository(User);

export const getUserByUsername = async (username: string) => {
  return await userRepository.findOneBy({ username });
};

export const createNewUser = async (
  username: string,
  password: string,
  role?: UserRole
) => {
  const newUser = userRepository.create({ username, password, role });
  return await userRepository.manager.transaction(async (manager) => {
    return await manager.save(newUser);
  });
};
