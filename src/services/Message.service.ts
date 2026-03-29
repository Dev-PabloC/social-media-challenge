import { MessageRepository } from "../repository/Message.repository";
import { createMessageSchema, editMessageSchema } from "../zod/message.schema";

const messageRepo = new MessageRepository();

export class MessageService {
  async createMessage(userId: string, data: unknown) {
    const parsed = createMessageSchema.parse(data);
    const saved = await messageRepo.createMessageInChat(parsed.chatId, userId, parsed.content);
    return saved;
  }

  async editMessage(userId: string, data: unknown) {
    const parsed = editMessageSchema.parse(data);
    const existing = await messageRepo.getMessageByIdWithUser(parsed.messageId);
    if (!existing) throw new Error("Message not found");
    if (existing.user.id !== userId) throw new Error("Unauthorized");
    return await messageRepo.updateMessage(parsed.messageId, { content: parsed.content });
  }

  async deleteMessage(userId: string, messageId: string) {
    const existing = await messageRepo.getMessageByIdWithUser(messageId);
    if (!existing) throw new Error("Message not found");
    if (existing.user.id !== userId) throw new Error("Unauthorized");
    return await messageRepo.deleteMessage(messageId);
  }
}

export default new MessageService();
