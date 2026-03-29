import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import AppDataSource from "../database/database";
import { socketHandler } from "./websocket/index";
import { socketAuth } from "./middlewares/authMiddleware";
import userController from "./controllers/User.controller";
import chatController from "./controllers/Chat.controller";
import messageController from "./controllers/Message.controller";
import authController from "./controllers/Auth.controller";
import errorHandler from "./middlewares/errorHandler";
import { UserRepository } from "./repository/User.repository";
import { ChatRepository } from "./repository/Chat.repository";
import { UserStatus } from "../database/entities/User.entity";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log("Database initialized");

    const app = express();
    app.use(express.json());

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    const userRepo = new UserRepository();
    const chatRepo = new ChatRepository();

    // mount API controllers
    app.use("/api/users", userController as any);
    app.use("/api/chats", chatController as any);
    app.use("/api/messages", messageController as any);
  app.use("/api/auth", authController as any);

  // global error handler
  app.use(errorHandler as any);

    // Socket auth middleware: use shared socketAuth (reads token from handshake.auth.token)
    io.use((socket, next) => socketAuth(socket, next));

    io.on("connection", async (socket) => {
      // if socket has a userId from JWT, mark online and auto-join chats
      const userId = (socket.data as any).userId as string | undefined;
      if (userId) {
        try {
          await userRepo.setUserStatus(userId, UserStatus.ONLINE);
          // find chats where this user is the owner/participant
          const chats = await chatRepo.findChatsByUserId(userId);
          for (const c of chats) {
            if (c?.id) socket.join(c.id);
          }
          socket.emit("presenceUpdated", { userId, status: UserStatus.ONLINE });
        } catch (err) {
          console.error("Error setting presence/auto-join", err);
        }
      }

      socketHandler(socket);
    });

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to bootstrap app", err);
    process.exit(1);
  }
}

bootstrap();
