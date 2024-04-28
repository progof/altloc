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

}  