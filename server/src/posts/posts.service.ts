import type { Pool } from "pg";
import { Post } from "../database";

export type CreatePostDTO = {
  title: string;
  content: string;
};


export class PostsService {
  constructor(private readonly db: Pool) {}

  async getPostsForUser(userId: string) {
    const result = await this.db.query<Post>(
      `SELECT * from posts WHERE user_id = $1;`,
      [userId],
    );
    return result.rows;
  }


  async getCountPostsByUserId(userId: string): Promise<number> {
    const result = await this.db.query<{ countnote: number }>(
      `SELECT COUNT(*) AS countnote FROM posts WHERE user_id = $1;`,
      [userId],
    );
    return result.rows[0]?.countnote || 0;
  }
  

  async getAllPosts(){
    const result = await this.db.query<Post>(
      `SELECT title, description, content users.username, posts.user_id, post_id, posts.created_at 
      FROM posts JOIN users ON posts.user_id = users.user_id`,
    );
    return result.rows;
  }

  async getPostById(postId: string) {
    const result = await this.db.query<Post>(
      `SELECT title, description, content  users.username, post_id, posts.user_id, posts.created_at, posts.edit_at
      FROM posts JOIN users ON posts.user_id = users.user_id WHERE post_id = $1;`,
      [postId],
    );
    return result.rows.at(0) || null;
  }

  async updatePost(postId: string, userId: string, data: CreatePostDTO) {
    const nowDate = new Date().toISOString();
    const result = await this.db.query<Post>(
      `UPDATE posts SET title = $3, content = $5 edit_at = $6 WHERE post_id = $1 AND user_id = $2 RETURNING *;`,
      [postId, userId, data.title,  data.content, nowDate],
    );
    return result.rows[0] as Post;
  }

  async createPost(userId: string, data: CreatePostDTO) {
    const result = await this.db.query<Post>(
      `INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3 ) RETURNING *;`,
      [userId, data.title, data.content ],
    );
    return result.rows[0] as Post;
  }

  async deletePostById(postId: string) {
    await this.db.query(`DELETE FROM posts WHERE post_id = $1;`, [
      postId,
    ]);
  }
}
