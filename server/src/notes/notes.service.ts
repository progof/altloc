import type { Pool } from "pg";
import { Note } from "../database";

export type CreateNoteDTO = {
  title: string;
  description: string;
  body: string;
  category: string;
};

export class NotesService {
  constructor(private readonly db: Pool) {}

  async getNotesForUser(userId: string) {
    const result = await this.db.query<Note>(
      `SELECT * from notes WHERE user_id = $1;`,
      [userId],
    );
    return result.rows;
  }

  async getNoteById(noteId: string) {
    const result = await this.db.query<Note>(
      `SELECT * from notes WHERE note_id = $1;`,
      [noteId],
    );
    return result.rows.at(0) || null;
  }

  async createNote(userId: string, data: CreateNoteDTO) {
    const result = await this.db.query<Note>(
      `INSERT INTO notes (user_id, title, description, body, category) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [userId, data.title, data.description, data.body, data.category],
    );
    return result.rows[0] as Note;
  }

  async deleteNoteById(noteId: string) {
    await this.db.query(`DELETE FROM notes WHERE note_id = $1;`, [
      noteId,
    ]);
  }
}
