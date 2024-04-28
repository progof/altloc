import { z } from "zod";
import { EventsService } from "./events.service";
import { Request, Response, Router } from "express";
import { blockNotVerifedUser } from "../middlewares/auth.middlewares";

export class EventsController {
  public readonly router = Router();

  constructor(
    private readonly eventsService: EventsService,
  ) {
    this.router.use("/events", blockNotVerifedUser);
    this.router.post("/events/:spaceId", this.createEvent.bind(this));
  }

  async createEvent(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
    }
    const userId = req.session.user.user_id;
    const bodySchema = z.object({
      space_id: z.string().uuid(),
      title: z.string(),
      description: z.string(),
      country: z.string(),
      city: z.string(),
      university: z.string(),
      category: z.string(),
    });
  
    const body = bodySchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).send({
        errors: body.error.issues,
      });
    }
    console.log("createSpace: ", body)
    try {
      const note = await this.eventsService.createEvent(body.data.space_id, userId, body.data);
      return res.status(201).send({ data: note });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }


}