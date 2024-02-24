import type { Pool } from "pg";
import { Space } from "../database";

export type CreateSpaceDTO = {
  title: string;
  description: string;
  country: string; 
    city: string;
  university: string;
  category: string;
};

export class SpacesService {
  constructor(private readonly db: Pool) {}

  async createSpace(userId: string, data: CreateSpaceDTO) {
    const result = await this.db.query<Space>(
      `INSERT INTO spaces (user_id, title, description, country, city, university, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
      [userId, data.title, data.description, data.country, data.city, data.university, data.category],
    );
    return result.rows[0] as Space;
  }

//   async getAllSpaces(){
//     const result = await this.db.query<Space>(
//       `SELECT title, description, body, category, users.username, notes.user_id, note_id, notes.created_at 
//       FROM notes JOIN users ON notes.user_id = users.user_id`,
//     );
//     return result.rows;
//   }


async getAllSpaces(){
    const result = await this.db.query<Space>(
      `SELECT title, description, country, city, university, category, users.username, spaces.user_id, space_id, spaces.created_at 
      FROM spaces JOIN users ON spaces.user_id = users.user_id`,
    );
    return result.rows;
  }

}