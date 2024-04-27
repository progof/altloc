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
    this.router.patch("/notes/:userId/:noteId", this.updateNote.bind(this));
    this.router.get("/notes", this.getNotes.bind(this));
    this.router.get("/all-notes", this.getAllNotes.bind(this));
    this.router.get("/count-notes/:userId", this.getCountNotes.bind(this));
    this.router.get("/user-notes/:userId", this.getNotesForUserId.bind(this));
    this.router.get("/space-notes/:spaceId", this.getNotesForSpaceId.bind(this));
    this.router.get("/notes/:noteId", this.getNote.bind(this));
    this.router.delete("/notes/:noteId", this.deleteNote.bind(this));
    this.router.patch("/like-note/:noteId", this.likeToNote.bind(this));
    this.router.post("/note-comments/:noteId", this.createNoteComment.bind(this));
    this.router.get("/note-comments/:noteId", this.getCommentsForNoteId.bind(this));
  }

  async createNote(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
    }
    const userId = req.session.user.user_id;
    const bodySchema = z.object({
      spaceId: z.string(),
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

    console.log("createNote -> spaceID", body.data.spaceId)

    try {
      const note = await this.notesService.createNote(userId, body.data.spaceId, body.data);
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

  async getCountNotes(req: Request, res: Response) {
    const paramsSchema = z.object({
      userId: z.string().uuid(),
    });

    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({
        errors: params.error.issues,
      });
    }

    try {
      const note = await this.notesService.getCountNotesByUserId(params.data.userId);
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

  async getNotesForUserId(req: Request, res: Response) {

    const paramsSchema = z.object({
      userId: z.string().uuid(),
    });

    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({
        errors: params.error.issues,
      });
    }

    try {
      const note = await this.notesService.getNotesForUser(params.data.userId);
      console.log("DEBUG (getNotesForUserId->note):", note);
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

  async getNotesForSpaceId(req: Request, res: Response) {

    const paramsSchema = z.object({
      spaceId: z.string().uuid(),
    });

    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({
        errors: params.error.issues,
      });
    }

    try {
      const note = await this.notesService.getNotesForSpace(params.data.spaceId);
      console.log("DEBUG (getNotesForSpaceId->note):", note);
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
    // const note = await this.notesService.getAllNotes();
    //   console.log("getAllNotes() data: ", note);
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

  async likeToNote(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
    }
    const userId = req.session.user.user_id;

    const paramsSchema = z.object({
      noteId: z.string().uuid(),
    });

    // if (!req.session.user) {
    //   return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
    // }

    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({ errors: params.error.issues });
    }
    const bodySchema = z.object({
      likes: z.number()
    });

    const body = bodySchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).send({
        errors: body.error.issues,
      });
    }

    console.log("Data from client:", body);

    const checkLike = await this.notesService.checkLikeOfPost(params.data.noteId, userId);
   console.log("checkLike", checkLike);

   if(checkLike?.note_id == params.data.noteId && checkLike.user_id == userId){
    return res.status(401).send({ errors: [{ message: "The user has already liked it." }] });
   }

  
    try {
      const like = await this.notesService.likeForNote(params.data.noteId, body.data.likes);
      const likeList = await this.notesService.likeToNote(params.data.noteId, userId);
      return res.status(201).send({ data: like, likeList });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }



  async createNoteComment(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
    }

    const paramsSchema = z.object({
      noteId: z.string(),
    });

    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({ errors: params.error.issues });
    }
    
    const userId = req.session.user.user_id;
    const bodySchema = z.object({
      comment: z.string(),
    });
  
    const content = bodySchema.safeParse(req.body);
    if (!content.success) {
      return res.status(400).send({
        errors: content.error.issues,
      });
    }

    console.log("Content data from user:", content.data);

    try {
      const commentOfNote = await this.notesService.createCommentForNote(params.data.noteId, userId, content.data);
      return res.status(201).send({ data: commentOfNote });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }


  async getCommentsForNoteId(req: Request, res: Response) {

    const paramsSchema = z.object({
      noteId: z.string().uuid(),
    });

    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({
        errors: params.error.issues,
      });
    }

    console.log("DEBUG getCommentsForNoteId() noteId:", params.data.noteId);
    try {
      const comment = await this.notesService.getCommentNoteById(params.data.noteId);
      console.log("DEBUG (getCommentsForNoteId->comment):", comment);
      return res.status(200).send({
        data: comment,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }
}
