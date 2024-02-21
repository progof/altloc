import { z } from "zod";
import { SpacesService } from "./spaces.service";
import { Request, Response, Router } from "express";
import { blockNotVerifedUser } from "../middlewares/auth.middlewares";

export class SpacesController {
  public readonly router = Router();

  constructor(
    private readonly spacesService: SpacesService,
  ) {
    this.router.use("/spaces", blockNotVerifedUser);
    this.router.post("/spaces", this.createNote.bind(this));
    this.router.patch("/spaces/:userId/:spacesId", this.updateNote.bind(this));
    this.router.get("/all-spaces", this.getAllNotes.bind(this));
    this.router.get("/spaces/:spacesId", this.getNote.bind(this));
    this.router.delete("/spaces/:spacesId", this.deleteNote.bind(this));
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
      const note = await this.spacesService.createSpace(userId, body.data);
      return res.status(201).send({ data: note });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }

  async updateNote(req: Request, res: Response) {}

  async getAllNotes(req: Request, res: Response) {}

  async getNote(req: Request, res: Response) {}

  async deleteNote(req: Request, res: Response) {}

  

}