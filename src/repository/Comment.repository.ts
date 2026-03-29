import AppDataSource from "../../database/database";
import { Comment } from "../../database/entities/Comment.entity";

export class CommentRepository {
  private commentRepository = AppDataSource.getRepository(Comment);

  public async createComment(data: Partial<Comment>): Promise<Comment> {
    const comment = this.commentRepository.create(data);
    await this.commentRepository.save(comment);
    return comment;
  }

  public async findCommentById(id: string): Promise<Comment | null> {
    return this.commentRepository.findOneBy({ id });
  }

  public async updateComment(
    id: string,
    data: Partial<Comment>
  ): Promise<Comment | null> {
    await this.commentRepository.update(id, data);
    return this.findCommentById(id);
  }

  public async deleteComment(id: string): Promise<void> {
    await this.commentRepository.delete(id);
  }

  public async findCommentsByPostId(postId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ["user"],
    });
  }

  public async findCommentsByUserId(userId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { user: { id: userId } },
      relations: ["post"],
    });
  }

  public async findCommentsByUserIdAndPostId(
    userId: string,
    postId: string
  ): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { user: { id: userId }, post: { id: postId } },
      relations: ["post"],
    });
  }

  public async findCommentsByUserIdWithPagination(
    userId: string,
    page: number,
    limit: number
  ): Promise<Comment[]> {
    const skip = (page - 1) * limit;
    return this.commentRepository.find({
      where: { user: { id: userId } },
      relations: ["post"],
      skip,
      take: limit,
    });
  }

  public async findCommentsByPostIdWithPagination(
    postId: string,
    page: number,
    limit: number
  ): Promise<Comment[]> {
    const skip = (page - 1) * limit;
    return this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ["user"],
      skip,
      take: limit,
    });
  }
}
