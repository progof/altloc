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
    this.router.get("/events/:spaceId", this.getSpaceEvent.bind(this));
  }

  // The create a new event
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

  // Get event by spaceId
  async getSpaceEvent(req: Request, res: Response) {
    const paramsSchema = z.object({
      spaceId: z.string(),
    });

    const params = paramsSchema.safeParse(req.params);
    console.log("getSpaceEvent() params: ", params);
    if (!params.success) {
      return res.status(400).send({
        errors: params.error.issues,
      });
    }

    
    try {
      console.log("getSpaceEvent() params.data.spaceId): ", params.data.spaceId);
      const spaceEvent = await this.eventsService.getSpaceEvemtBySpaceId(params.data.spaceId);
      console.log("getSpaceEvent() data: ", spaceEvent);
      return res.status(200).send({
        data: spaceEvent,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }


}