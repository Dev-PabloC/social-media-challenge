import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User.entity";
import { Comment } from "./Comment.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  content: string;

  @Column({ nullable: false })
  createdAt: Date;

  @Column({ nullable: false })
  updatedAt: Date;

  @Column({ nullable: false })
  likes: number;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
