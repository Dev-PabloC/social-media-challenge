import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export function decodeToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    return payload;
  } catch (err) {
    return null;
  }
}

export function signToken(payload: object, options?: jwt.SignOptions) {
  return jwt.sign(payload as any, JWT_SECRET, options);
}

export default { decodeToken, signToken };
