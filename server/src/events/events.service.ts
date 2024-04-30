import type { Pool } from "pg";
import { SpaceEvents } from "../database";

export type CreateSpaceEventDTO = {
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    date: string;
};

export class EventsService {
  constructor(private readonly db: Pool) {}

  async createEvent(spaceId: string, userId: string, data: CreateSpaceEventDTO) {
    const result = await this.db.query<SpaceEvents>(
      `INSERT INTO space_events (space_id, creator, title, description, start_time, end_time, date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
      [spaceId, userId, data.title, data.description, data.start_time, data.end_time, data.date,],
    );
    return result.rows[0] as SpaceEvents;
  }

  async getSpaceEvemtBySpaceId(spaceId: string) {
    const result = await this.db.query<SpaceEvents>(
      `SELECT se.title, se.description, se.start_time, se.end_time, se.date, se.creator, se.created_at, se.space_id, users.username, spaces.title as spacename
      FROM space_events AS se 
      JOIN users ON se.creator = users.user_id 
      JOIN spaces ON se.space_id = spaces.space_id
      WHERE se.space_id = $1;`,
      [spaceId],
    );
    // return result.rows.at(0) || null;
    // return result.rows[0] as SpaceEvents;
    return result.rows;
  }

}  