import type { Pool } from "pg";
import { Space, Spaces_users } from "../database";

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

  async followToSpace(spaceId: string, userId: string) {
    const result = await this.db.query<Spaces_users>(
      `INSERT INTO spaces_users (space_id, user_id) VALUES ($1, $2) RETURNING *;`,
      [spaceId, userId],
    );
    return result.rows[0] as Spaces_users;
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


  async getSpaceById(spaceId: string) {
    const result = await this.db.query<Space>(
      `SELECT title, description,  country, city, university, category, users.username, space_id, spaces.user_id, spaces.created_at, spaces.edit_at
      FROM spaces JOIN users ON spaces.user_id = users.user_id WHERE space_id = $1;`,
      [spaceId],
    );
    return result.rows.at(0) || null;
  }


  // async getNoteById(noteId: string) {
  //   const result = await this.db.query<Note>(
  //     `SELECT title, description, body, category, users.username, note_id, notes.user_id, notes.created_at, notes.edit_at
  //     FROM notes JOIN users ON notes.user_id = users.user_id WHERE note_id = $1;`,
  //     [noteId],
  //   );
  //   return result.rows.at(0) || null;
  // }
}