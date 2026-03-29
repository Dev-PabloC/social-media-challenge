import { UserRepository } from "../repository/User.repository";
import { loginSchema } from "../zod/auth.schema";
import { comparePassword } from "../utils/passwordHash";
import { signToken } from "../utils/jwtDecoder";
import { AppError } from "../errors/AppError";

const userRepo = new UserRepository();

export class AuthService {
  async login(data: unknown) {
    const parsed = loginSchema.parse(data);
    const user = await userRepo.findUserByEmail(parsed.email);
    if (!user) throw new AppError("Invalid credentials", 401);
    const ok = await comparePassword(parsed.password, user.password);
    if (!ok) throw new AppError("Invalid credentials", 401);
    const token = signToken({ id: user.id, email: user.email });
    const safeUser = { ...user } as any;
    delete safeUser.password;
    return { token, user: safeUser };
  }
}

export default new AuthService();
