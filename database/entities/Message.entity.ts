import { User } from "./User.entity";
import { Chat } from "./Chat.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  content: string;
  
  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.messages, { nullable: false })
  chat: Chat;
}
