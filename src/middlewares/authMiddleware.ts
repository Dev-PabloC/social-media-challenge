import { Request, Response, NextFunction } from "express";
import { Socket } from "socket.io";
import { decodeToken } from "../utils/jwtDecoder";

export function expressAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = (req.headers["authorization"] || req.headers["Authorization"]) as
      | string
      | undefined;
    if (!authHeader) return res.status(401).json({ error: "Missing authorization header" });
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer")
      return res.status(401).json({ error: "Invalid authorization header format" });
    const token = parts[1];
    const payload = decodeToken(token);
    if (!payload) return res.status(401).json({ error: "Invalid token" });
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Authentication error" });
  }
}

// Socket.io middleware: expects token in handshake.auth.token
export function socketAuth(socket: Socket, next: (err?: Error) => void) {
  try {
    const token = (socket.handshake.auth && (socket.handshake.auth as any).token) || null;
    if (!token) return next(new Error("Authentication error: missing token"));
    const payload = decodeToken(token);
    if (!payload) return next(new Error("Authentication error: invalid token"));
    (socket.data as any).user = payload; // store full payload
    (socket.data as any).userId = payload.id || payload.userId || payload.sub;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
}

export default { expressAuth, socketAuth };
