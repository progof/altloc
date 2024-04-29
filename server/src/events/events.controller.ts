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
    this.router.post("/events", this.createEvent.bind(this));
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
      start_time: z.string(),
      end_time: z.string(),
      date: z.string(),
    });
  
    const body = bodySchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).send({
        errors: body.error.issues,
      });
    }
    console.log("createEvent: ", body)
    try {
      const event = await this.eventsService.createEvent(body.data.space_id, userId, body.data);
      return res.status(201).send({ data: event });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }


}