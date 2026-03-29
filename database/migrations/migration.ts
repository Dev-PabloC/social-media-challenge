import { User } from "../entities/User.entity";
import { Post } from "../entities/Post.entity";
import { Comment } from "../entities/Comment.entity";
import { Chat } from "../entities/Chat.entity";
import { Message } from "../entities/Message.entity";

export class Migration {
  public async up(queryRunner: any): Promise<void> {
    await queryRunner.createTable(
      new User().constructor,
      new Post().constructor,
      new Comment().constructor,
      new Chat().constructor,
      new Message().constructor
    );
  }

  public async down(queryRunner: any): Promise<void> {
    await queryRunner.dropTable("User");
    await queryRunner.dropTable("Post");
    await queryRunner.dropTable("Comment");
    await queryRunner.dropTable("Chat");
    await queryRunner.dropTable("Message");
  }
}
