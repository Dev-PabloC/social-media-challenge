import * as bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRoundsEnv = Number(process.env.PASSWORD_HASH_LENGTH);
  const saltRounds = Number.isFinite(saltRoundsEnv) && saltRoundsEnv > 0 ? saltRoundsEnv : 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
