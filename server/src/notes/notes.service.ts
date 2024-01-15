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

  async getAllNotes(){
    const result = await this.db.query<Note>(
      `SELECT title, description, body, category, users.username, note_id, notes.created_at 
      FROM notes JOIN users ON notes.user_id = users.user_id`,
    );
    return result.rows;
  }

  async getNoteById(noteId: string) {
    const result = await this.db.query<Note>(
      `SELECT title, description, body, category, users.username, note_id, notes.created_at 
      FROM notes JOIN users ON notes.user_id = users.user_id WHERE note_id = $1;`,
      [noteId],
    );
    return result.rows.at(0) || null;
  }

  async updateNote(noteId: string, data: CreateNoteDTO) {
    const result = await this.db.query<Note>(
      `UPDATE notes SET title = $2, description = $3, body = $4, category = $5 WHERE  note_id = $1 RETURNING *;`,
      [noteId, data.title, data.description, data.body, data.category],
    );
    return result.rows[0] as Note;
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
