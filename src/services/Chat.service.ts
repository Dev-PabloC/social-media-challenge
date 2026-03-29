import { ChatRepository } from "../repository/Chat.repository";
import { createChatSchema, addParticipantSchema } from "../zod/chat.schema";

const chatRepo = new ChatRepository();

export class ChatService {
  async createChat(ownerId: string, data: unknown) {
    const parsed = createChatSchema.parse(data);
    const chat = await chatRepo.createChat({
      ...parsed,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: { id: ownerId } as any,
    } as any);
    // add participants if provided
    if (parsed.participants && parsed.participants.length) {
      const existing = await chatRepo.getChatById(chat.id);
      if (existing) {
        existing.participants = parsed.participants.map((id) => ({ id } as any));
        await chatRepo.updateChat(existing.id, existing as any);
      }
    }
    return chat;
  }

  async addParticipant(data: unknown) {
    const parsed = addParticipantSchema.parse(data);
    const chat = await chatRepo.getChatById(parsed.chatId);
    if (!chat) throw new Error("Chat not found");
    chat.participants = chat.participants || [];
    if (!chat.participants.find((p) => p.id === parsed.userId)) {
      chat.participants.push({ id: parsed.userId } as any);
    }
    await chatRepo.updateChat(chat.id, chat as any);
    return chat;
  }

  async findChatsByUserId(userId: string) {
    return await chatRepo.findChatsByUserId(userId);
  }
}

export default new ChatService();
