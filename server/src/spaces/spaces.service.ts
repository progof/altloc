import type { Pool } from "pg";
import { Space } from "../database";

export type CreateSpaceDTO = {
  title: string;
  description: string;
  category: string;
};

export class SpacesService {
  constructor(private readonly db: Pool) {}

  async createSpace(userId: string, data: CreateSpaceDTO) {
    const result = await this.db.query<Space>(
      `INSERT INTO spaces (user_id, title, description, category) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [userId, data.title, data.description, data.category],
    );
    return result.rows[0] as Space;
  }

}