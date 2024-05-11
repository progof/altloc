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
    this.router.delete("/events/:eventId", this.deleteEvent.bind(this));
    this.router.get("/events/:spaceId", this.getSpaceEvent.bind(this));
    this.router.post("/follow-events/:eventId", this.followToEvents.bind(this));
    this.router.get("/count-events/:eventId", this.getCountEventMembers.bind(this));
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

  // Delete event by eventId
  async deleteEvent(req: Request, res: Response) {
    const paramsSchema = z.object({
      eventId: z.string().uuid(),
    });

    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({ errors: params.error.issues });
    }

    try {
      await this.eventsService.deleteEventById(params.data.eventId);
      return res.status(200).send();
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }

  async followToEvents(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
    }
    const userId = req.session.user.user_id;

    const paramsSchema = z.object({
      eventId: z.string().uuid(),
    });


    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({ errors: params.error.issues });
    }
    
    // const bodySchema = z.object({
    //   likes: z.number()
    // });

    // const body = bodySchema.safeParse(req.body);
    // if (!body.success) {
    //   return res.status(400).send({
    //     errors: body.error.issues,
    //   });
    // }

    // console.log("Data from client:", body);

    const checkEventMembers = await this.eventsService.checkEventList(params.data.eventId, userId);
   console.log("checkLike", checkEventMembers);

   if(checkEventMembers?.event_id == params.data.eventId && checkEventMembers.user_id == userId){
    return res.status(401).send({ errors: [{ message: "The user has already followed it." }] });
   }

  
    try {
      const EventMembers = await this.eventsService.followToEvent(params.data.eventId, userId);
  
      return res.status(201).send({ data: EventMembers });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }

  // Count members for event

  async getCountEventMembers(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
    }
    const userId = req.session.user.user_id;

    const paramsSchema = z.object({
      eventId: z.string().uuid(),
    });

    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({
        errors: params.error.issues,
      });
    }

    console.log("DEBUG getCountEventMembers() eventId", params.data.eventId);
    console.log("DEBUG getCountEventMembers() userId", userId);

    try {
      const eventMembers = await this.eventsService.getCountEventMember(params.data.eventId, userId);
      console.log("DEBUG getCountEventMembers()", eventMembers);
      return res.status(200).send({
        data: eventMembers,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }

}