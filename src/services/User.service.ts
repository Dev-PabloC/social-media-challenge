import { UserRepository } from "../repository/User.repository";
import { createUserSchema, updateUserSchema } from "../zod/user.schema";
import { hashPassword } from "../utils/passwordHash";

const userRepo = new UserRepository();

export class UserService {
  async createUser(data: unknown) {
    const parsed = createUserSchema.parse(data);
    const passwordCrypted = await hashPassword(parsed.password);
    const user = await userRepo.createUser({
      name: parsed.name,
      email: parsed.email,
      password: passwordCrypted,
      createdAt: new Date(),
    });
    return user;
  }

  async updateUser(id: string, data: unknown) {
    const parsed = updateUserSchema.parse(data);
    if (parsed.password) parsed.password = await hashPassword(parsed.password);
    return await userRepo.updateUser(id, parsed as any);
  }

  async findById(id: string) {
    return await userRepo.findUserById(id);
  }

  async deleteUser(id: string) {
    return await userRepo.deleteUser(id);
  }
}

export default new UserService();
