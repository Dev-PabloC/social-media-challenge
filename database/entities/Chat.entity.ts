import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "./User.entity";
import { Message } from "./Message.entity";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  message: string;
  
  @Column({ nullable: false })
  createdAt: Date;

  @Column({ nullable: false })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.chats)
  user: User;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @ManyToMany(() => User, (user) => user.chatsParticipating)
  @JoinTable()
  participants: User[];
}
