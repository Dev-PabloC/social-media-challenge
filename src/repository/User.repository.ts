import AppDataSource from "../../database/database";
import { User, UserStatus } from "../../database/entities/User.entity";

export class UserRepository {
  private userRepository = AppDataSource.getRepository(User);

  public async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create({
      ...data,
    });
    await this.userRepository.save(user);
    return user;
  }

  public async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  public async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, data);
    return this.findUserById(id);
  }

  public async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  public async setUserStatus(id: string, status: UserStatus): Promise<User | null> {
    await this.userRepository.update(id, { status } as Partial<User>);
    return this.findUserById(id);
  }
}
