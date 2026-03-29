import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { Post } from "./Post.entity";
import { Comment } from "./Comment.entity";
import { Chat } from "./Chat.entity";
import { Message } from "./Message.entity";

export enum UserStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  createdAt: Date;

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.OFFLINE,
  })
  status: UserStatus;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Chat[];

  @ManyToMany(() => Chat, (chat) => chat.participants)
  chatsParticipating: Chat[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}
