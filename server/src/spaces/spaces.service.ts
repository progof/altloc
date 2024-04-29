import type { Pool } from "pg";
import { Space, SpaceMembers, SpaceFollow } from "../database";

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


  async getSpaceById(spaceId: string) {
    const result = await this.db.query<Space>(
      `SELECT title, description,  country, city, university, category, users.username, space_id, spaces.user_id, spaces.created_at, spaces.edit_at
      FROM spaces JOIN users ON spaces.user_id = users.user_id WHERE space_id = $1;`,
      [spaceId],
    );
    return result.rows.at(0) || null;
  }


  async getSpaceMembersById(spaceId: string) {
    const result = await this.db.query<SpaceMembers>(
      `SELECT u.username, u.user_id
      FROM spaces_members AS sp
      JOIN users AS u ON sp.user_id = u.user_id
      WHERE sp.space_id = $1`,
      [spaceId],
    );
    return result.rows;
    // return result.rows[0] as SpaceMembers;
  }


  async followToSpace(spaceId: string, userId: string) {
    const result = await this.db.query<SpaceMembers>(
      `INSERT INTO spaces_members (space_id, user_id) VALUES ($1, $2) RETURNING *;`,
      [spaceId, userId],
    );
    return result.rows[0] as SpaceMembers;
  }

  async UnFollowToSpace(spaceId: string, userId: string) {
    const result = await this.db.query<SpaceMembers>(
      `DELETE FROM spaces_members WHERE space_id = $1 AND user_id = $2;`,
      [spaceId, userId],
    );
    return result.rows;
  }

  async isUserFollowingSpace(spaceId: string, userId: string) {
    const result = await this.db.query<{ count: number }>(
      `SELECT COUNT(*) FROM spaces_members WHERE space_id = $1 AND user_id = $2;`,
      [spaceId, userId],
    );
    return result.rows.at(0) || null;
  }

  async checkFollowingToSpace(spaceId: string, userId: string) {
    const result = await this.db.query<SpaceFollow>(
      `SELECT * FROM spaces_members WHERE space_id = $1 AND user_id = $2;`,
      [spaceId, userId],
    );
    // return result.rows.at(0) || null;
    return result.rows[0] as SpaceFollow;
  }


}