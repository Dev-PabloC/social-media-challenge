import { Socket } from "socket.io";
import { MessageRepository } from "../repository/Message.repository";
import { UserRepository } from "../repository/User.repository";
import { UserStatus } from "../../database/entities/User.entity";

const messageRepo = new MessageRepository();
const userRepo = new UserRepository();

export const socketHandler = (socket: Socket) => {
  console.log("A user connected", socket.id);

  // Presence now handled at connection time by the server (JWT auth + auto-join)

  // Create a message in a chat
  // payload: { chatId, content }
  socket.on(
    "createMessage",
    async (payload: { chatId: string; content: string }) => {
      try {
        const { chatId, content } = payload || {};
        const userId = (socket.data as any).userId as string | undefined;
        if (!chatId || !userId || !content) return;

        const saved = await messageRepo.createMessageInChat(chatId, userId, content);

        // Broadcast to all sockets in the chat room (including sender)
        socket.to(chatId).emit("messageCreated", saved);
        socket.emit("messageCreated", saved);
      } catch (err) {
        console.error("createMessage error", err);
        socket.emit("error", { code: "create_message_error", detail: err });
      }
    }
  );

  // Edit a message: payload { messageId, content }
  socket.on("editMessage", async (payload: { messageId: string; content: string }) => {
    try {
      const { messageId, content } = payload || {};
      const userId = (socket.data as any).userId as string | undefined;
      if (!messageId || !userId || !content) return;

      const existing = await messageRepo.getMessageByIdWithUser(messageId);
      if (!existing) {
        socket.emit("error", { code: "message_not_found" });
        return;
      }
      if (existing.user.id !== userId) {
        socket.emit("error", { code: "unauthorized" });
        return;
      }

      const updated = await messageRepo.updateMessage(messageId, { content });
      // Notify room
      const chatId = (existing.chat && (existing.chat as any).id) || null;
      if (chatId) socket.to(chatId).emit("messageEdited", updated);
      socket.emit("messageEdited", updated);
    } catch (err) {
      console.error("editMessage error", err);
      socket.emit("error", { code: "edit_message_error", detail: err });
    }
  });

  // Delete a message: payload { messageId }
  socket.on("deleteMessage", async (payload: { messageId: string }) => {
    try {
      const { messageId } = payload || {};
      const userId = (socket.data as any).userId as string | undefined;
      if (!messageId || !userId) return;

      const existing = await messageRepo.getMessageByIdWithUser(messageId);
      if (!existing) {
        socket.emit("error", { code: "message_not_found" });
        return;
      }
      if (existing.user.id !== userId) {
        socket.emit("error", { code: "unauthorized" });
        return;
      }

      const deleted = await messageRepo.deleteMessage(messageId);
      const chatId = (existing.chat && (existing.chat as any).id) || null;
      if (deleted && chatId) socket.to(chatId).emit("messageDeleted", { messageId });
      if (deleted) socket.emit("messageDeleted", { messageId });
    } catch (err) {
      console.error("deleteMessage error", err);
      socket.emit("error", { code: "delete_message_error", detail: err });
    }
  });

  socket.on("disconnect", async () => {
    try {
      const userId = (socket.data as any).userId as string | undefined;
      if (userId) {
        await userRepo.setUserStatus(userId, UserStatus.OFFLINE);
        console.log(`Set user ${userId} offline due to disconnect`);
      }
    } catch (err) {
      console.error("disconnect handler error", err);
    }
    console.log("User disconnected", socket.id);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  socket.on("typing", (payload: { chatId: string; userId: string }) => {
    if (!payload?.chatId) return;
    socket.to(payload.chatId).emit("typing", { userId: payload.userId });
  });

  socket.on("stopTyping", (payload: { chatId: string; userId: string }) => {
    if (!payload?.chatId) return;
    socket.to(payload.chatId).emit("stopTyping", { userId: payload.userId });
  });
};
