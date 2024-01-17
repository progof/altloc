import { z } from "zod";
import { NotesService } from "./notes.service";
import { Request, Response, Router } from "express";
import { blockNotVerifedUser } from "../middlewares/auth.middlewares";

export class NotesController {
  public readonly router = Router();

  constructor(
    private readonly notesService: NotesService,
  ) {
    this.router.use("/notes", blockNotVerifedUser);
    this.router.post("/notes", this.createNote.bind(this));
    this.router.post("/update-notes/:noteId/:userId", this.updateNote.bind(this));
    this.router.get("/notes", this.getNotes.bind(this));
    this.router.get("/all-notes", this.getAllNotes.bind(this));
    this.router.get("/notes/:noteId", this.getNote.bind(this));
    this.router.delete("/notes/:noteId", this.deleteNote.bind(this));
  }

  async createNote(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
    }
    const userId = req.session.user.user_id;
    const bodySchema = z.object({
      title: z.string(),
      description: z.string(),
      body: z.string(),
      category: z.string(),
    });
  
    const body = bodySchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).send({
        errors: body.error.issues,
      });
    }

    try {
      const note = await this.notesService.createNote(userId, body.data);
      return res.status(201).send({ data: note });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }

  async updateNote(req: Request, res: Response) {
    const paramsSchema = z.object({
      noteId: z.string().uuid(),
      userId: z.string().uuid(),
    });

    if (!req.session.user) {
      return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
    }

    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({ errors: params.error.issues });
    }
    const bodySchema = z.object({
      title: z.string(),
      description: z.string(),
      body: z.string(),
      category: z.string(),
    });

    const body = bodySchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).send({
        errors: body.error.issues,
      });
    }

    try {
      const note = await this.notesService.updateNote(params.data.noteId, params.data.userId, body.data);
      return res.status(201).send({ data: note });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }

  async getNotes(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
    }

    try {
      const notes = await this.notesService.getNotesForUser(
        req.session.user.user_id,
      );
      return res.status(200).send({
        data: notes,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }

  async getNote(req: Request, res: Response) {
    const paramsSchema = z.object({
      noteId: z.string(),
    });

    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({
        errors: params.error.issues,
      });
    }

    try {
      const note = await this.notesService.getNoteById(params.data.noteId);
      return res.status(200).send({
        data: note,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }

  async getAllNotes(req: Request, res: Response) {
    const note = await this.notesService.getAllNotes();
      console.log("getAllNotes() data: ", note);
    try {
      const note = await this.notesService.getAllNotes();
      console.log("getAllNotes() data: ", note);
      return res.status(200).send({
        data: note,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }

  async deleteNote(req: Request, res: Response) {
    const paramsSchema = z.object({
      noteId: z.string().uuid(),
    });

    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({ errors: params.error.issues });
    }

    try {
      await this.notesService.deleteNoteById(params.data.noteId);
      return res.status(200).send();
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }
}
