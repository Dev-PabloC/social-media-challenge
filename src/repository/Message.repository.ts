import AppDataSource from "../../database/database";
import { Message } from "../../database/entities/Message.entity";

export class MessageRepository {
  private messageRepository = AppDataSource.getRepository(Message);

  async createMessage(messageData: Partial<Message>): Promise<Message> {
    const message = this.messageRepository.create(messageData);
    return await this.messageRepository.save(message);
  }
  
  async createMessageInChat(
    chatId: string,
    userId: string,
    content: string
  ): Promise<Message> {
    const message = this.messageRepository.create({
      content,
      chat: { id: chatId } as any,
      user: { id: userId } as any,
    } as Partial<Message>);
    return await this.messageRepository.save(message);
  }
  async getMessageById(id: string): Promise<Message | null> {
    return await this.messageRepository.findOneBy({ id: id });
  }

  async getMessageByIdWithUser(id: string): Promise<Message | null> {
    return await this.messageRepository.findOne({
      where: { id },
      relations: ["user", "chat"],
    });
  }

  async updateMessage(
    id: string,
    messageData: Partial<Message>
  ): Promise<Message | null> {
    const message = await this.getMessageById(id);
    if (!message) {
      return null;
    }
    this.messageRepository.merge(message, messageData);
    return await this.messageRepository.save(message);
  }

  async deleteMessage(id: string): Promise<boolean> {
    const result = await this.messageRepository.delete(id);
    return result.affected !== 0;
  }

  async findMessagesByChatId(chatId: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { chat: { id: chatId } },
      relations: ["user"],
      order: { id: "ASC" },
    });
  }

  async findMessagesBySearchTerm(searchTerm: string): Promise<Message[]> {
    return await this.messageRepository
      .createQueryBuilder("message")
      .where("message.content LIKE :searchTerm", {
        searchTerm: `%${searchTerm}%`,
      })
      .getMany();
  }
}
