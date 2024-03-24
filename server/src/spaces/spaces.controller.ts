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
    this.router.post("/spaces", this.createSpace.bind(this));
    this.router.patch("/spaces/:userId/:spacesId", this.updateNote.bind(this));
    this.router.get("/all-spaces", this.getAllSpaces.bind(this));
    this.router.get("/spaces/:spaceId", this.getSpace.bind(this));
    this.router.delete("/spaces/:spacesId", this.deleteNote.bind(this));
    // this.router.post("/follow/:spaceId/:userId", this.followToSpace.bind(this));
    this.router.post("/spaces/follow", this.followToSpace.bind(this));
    this.router.post("/spaces/unfollow", this.UnfollowToSpace.bind(this));
    this.router.get("/spaces/check-following/:spaceId", this.checkFollowingToSpace.bind(this));
    this.router.get("/spaces/members/:spaceId", this.getSpace.bind(this));
  }

  async createSpace(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
    }
    const userId = req.session.user.user_id;
    const bodySchema = z.object({
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


  async deleteNote(req: Request, res: Response) {}

  async getAllSpaces(req: Request, res: Response) {
    // const note = await this.notesService.getAllNotes();
    //   console.log("getAllNotes() data: ", note);
    try {
      const space = await this.spacesService.getAllSpaces();
      console.log("getAllSpaces() data: ", space);
      
      return res.status(200).send({
        data: space,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }

  async getSpace(req: Request, res: Response) {
    const paramsSchema = z.object({
      spaceId: z.string(),
    });

    const params = paramsSchema.safeParse(req.params);
    console.log("getSpace() params: ", params);
    if (!params.success) {
      return res.status(400).send({
        errors: params.error.issues,
      });
    }

    
    try {
      console.log("getSpace() params.data.spaceId): ", params.data.spaceId);
      const space = await this.spacesService.getSpaceById(params.data.spaceId);
      console.log("getSpace() data: ", space);
      return res.status(200).send({
        data: space,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }


async followToSpace(req: Request, res: Response) {
  if (!req.session.user) {
    return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
  }
  const userId = req.session.user.user_id;
  const bodySchema = z.object({
    space_id: z.string().uuid(),
  });

  const body = bodySchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).send({
      errors: body.error.issues,
    });
  }
  
  console.log('followToSpace.data', body.data.space_id, userId );
  
  try {
    // Check if the user is already subscribed to the group
    const isFollowing = await this.spacesService.isUserFollowingSpace(body.data.space_id, userId);
    console.log("conut follow:", isFollowing)

    if (!isFollowing) {
      // If the user is already subscribed, return an error message
      console.log("DEBUG: {Error} -> User is already following this space [SpceID/UserID]", body.data.space_id, userId  )
      return res.status(400).send({ errors: [{ message: "User is already following this space" }] });
    }

    // If the user is not subscribed, perform subscription
    const follow = await this.spacesService.followToSpace(body.data.space_id, userId);
    return res.status(201).send({ data: follow, following: true });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      errors: [{ message: "Internal Server Error" }],
    });
  }
}

async UnfollowToSpace(req: Request, res: Response) {
  if (!req.session.user) {
    return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
  }
  const userId = req.session.user.user_id;
  const bodySchema = z.object({
    space_id: z.string().uuid(),
  });

  const body = bodySchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).send({
      errors: body.error.issues,
    });
  }
  
  console.log('followToSpace.data', body.data.space_id, userId );
  
  try {

    const unfollow = await this.spacesService.UnFollowToSpace(body.data.space_id, userId);
    return res.status(201).send({ data: unfollow, following: false });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      errors: [{ message: "Internal Server Error" }],
    });
  }
}

async checkFollowingToSpace(req: Request, res: Response) {
  if (!req.session.user) {
    return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
  }
  const userId = req.session.user.user_id;
  
  const paramsSchema = z.object({
    spaceId: z.string(),
  });

  const params = paramsSchema.safeParse(req.params);
  console.log("checkFollowingToSpace() params: ", params);
  if (!params.success) {
    return res.status(400).send({
      errors: params.error.issues,
    });
  }

  
  try {
    console.log("checkFollowingToSpace() params.data.spaceId): ", params.data.spaceId);
    const isFollowing = await this.spacesService.isUserFollowingSpace(params.data.spaceId, userId);
    console.log("checkFollowingToSpace() data: ", isFollowing);
    let resulteCheck = false; 
    
    if(isFollowing){
      resulteCheck = true
    } else {
      resulteCheck = false
    }


    return res.status(200).send({
      data: resulteCheck,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      errors: [{ message: "Internal Server Error" }],
    });
  }
}

// async followToSpace(req: Request, res: Response) {
//   if (!req.session.user) {
//     return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
//   }
//   const userId = req.session.user.user_id;
//   const bodySchema = z.object({
//     space_id: z.string().uuid(),
//     // userId: z.string().uuid(),
//   });

//   const body = bodySchema.safeParse(req.body);
//   if (!body.success) {
//     return res.status(400).send({
//       errors: body.error.issues,
//     });
//   }
//   console.log('followToSpace.data', body.data.space_id, userId )
//   try {
//     const follow = await this.spacesService.followToSpace(body.data.space_id, userId);
//     return res.status(201).send({ data: follow });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({
//       errors: [{ message: "Internal Server Error" }],
//     });
//   }
// }


async getSpaceMembers(req: Request, res: Response) {
  const paramsSchema = z.object({
    spaceId: z.string(),
  });

  const params = paramsSchema.safeParse(req.params);
  console.log("getSpaceMembers() params: ", params);
  if (!params.success) {
    return res.status(400).send({
      errors: params.error.issues,
    });
  }

  
  try {
    console.log("getSpaceMembers() params.data.spaceId): ", params.data.spaceId);
    const space = await this.spacesService.getSpaceMembersById(params.data.spaceId);
    console.log("getSpaceMembers() data: ", space);
    return res.status(200).send({
      data: space,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      errors: [{ message: "Internal Server Error" }],
    });
  }
}


}