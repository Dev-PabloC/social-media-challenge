import AppDataSource from "../../database/database";
import { Chat } from "../../database/entities/Chat.entity";

export class ChatRepository {
  private chatRepository = AppDataSource.getRepository(Chat);

  async createChat(chatData: Partial<Chat>): Promise<Chat> {
    const chat = this.chatRepository.create(chatData);
    return await this.chatRepository.save(chat);
  }

  async getChatById(id: string): Promise<Chat | null> {
    return await this.chatRepository.findOneBy({ id: id });
  }

  async updateChat(id: string, chatData: Partial<Chat>): Promise<Chat | null> {
    const chat = await this.getChatById(id);
    if (!chat) {
      return null;
    }
    this.chatRepository.merge(chat, chatData);
    return await this.chatRepository.save(chat);
  }
  
  async deleteChat(id: string): Promise<boolean> {
    const result = await this.chatRepository.delete(id);
    return result.affected !== 0;
  }

  async findChatsByUserId(userId: string): Promise<Chat[]> {
    return await this.chatRepository
      .createQueryBuilder("chat")
      .leftJoinAndSelect("chat.participants", "participant")
      .where("participant.id = :userId", { userId })
      .orWhere("chat.userId = :userId", { userId })
      .getMany();
  }
}
