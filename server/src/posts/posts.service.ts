import type { Pool } from "pg";
import { Post, LikesOfUsers } from "../database";

export type CreatePostDTO = {
  title: string;
  content: string;
};

export type CreateCommentPostDTO = {
  comment: string;
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
      `SELECT title, content, users.username, posts.user_id, post_id, posts.created_at, likes 
      FROM posts JOIN users ON posts.user_id = users.user_id`,
    );
    return result.rows;
  }

  async getPostById(postId: string) {
    const result = await this.db.query<Post>(
      `SELECT title, content,  users.username, post_id, posts.user_id, posts.created_at, posts.edit_at, likes
      FROM posts JOIN users ON posts.user_id = users.user_id WHERE post_id = $1;`,
      [postId],
    );
    return result.rows.at(0) || null;
  }

// Like of post
  async likeForPost(postId: string, likes: number) {
    const result = await this.db.query<Post>(
      `UPDATE posts SET likes = $2 WHERE post_id = $1 RETURNING *;`,
      [postId, likes],
    );
    // return result.rows[0] as Post;
    return result.rows.at(0) || null;
  }

  async likeToPost(postId: string, userId: string) {
    const result = await this.db.query<LikesOfUsers>(
      `INSERT INTO likes_posts(post_id, user_id) VALUES ($1, $2) RETURNING *;`,
      [postId, userId],
    );
    return result.rows[0] as LikesOfUsers;
  }

  async checkLikeOfPost(postId: string, userId: string) {
    const result = await this.db.query<LikesOfUsers>(
      `SELECT * FROM likes_posts WHERE post_id = $1 AND user_id = $2 `,
      [postId, userId],
    );
    // return result.rows[0] as Post;
    return result.rows.at(0) || null;
  }

// Comment of post

async createCommentForPost(postId: string, userId: string, data: CreateCommentPostDTO) {
  const result = await this.db.query<Post>(
    `INSERT INTO comments_posts (post_id, user_id, comment) VALUES ($1, $2, $3 ) RETURNING *;`,
    [postId, userId, data.comment ],
  );
  return result.rows[0] as Post;
}

async getCommentPostById(postId: string) {
  const result = await this.db.query<Post>(
    `SELECT comments_posts.comment, users.username, comments_posts.created_at
    FROM comments_posts JOIN users ON comments_posts.user_id = users.user_id WHERE post_id = $1;`,
    [postId],
  );
  // return result.rows.at(0) || null;
  return result.rows || [];
}

  async updatePost(postId: string, userId: string, data: CreatePostDTO) {
    const nowDate = new Date().toISOString();
    const result = await this.db.query<Post>(
      `UPDATE posts SET title = $3, content = $4, edit_at = $5 WHERE post_id = $1 AND user_id = $2 RETURNING *;`,
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
