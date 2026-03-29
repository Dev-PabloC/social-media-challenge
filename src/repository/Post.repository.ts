import AppDataSource from "../../database/database";
import { Post } from "../../database/entities/Post.entity";

export class PostRepository {
  private postRepository = AppDataSource.getRepository(Post);

  public async createPost(data: Partial<Post>): Promise<Post> {
    const post = this.postRepository.create(data);
    await this.postRepository.save(post);
    return post;
  }

  public async findPostById(id: string): Promise<Post | null> {
    return this.postRepository.findOneBy({ id });
  }

  public async updatePost(
    id: string,
    data: Partial<Post>
  ): Promise<Post | null> {
    await this.postRepository.update(id, data);
    return this.findPostById(id);
  }

  public async deletePost(id: string): Promise<void> {
    await this.postRepository.delete(id);
  }
}
