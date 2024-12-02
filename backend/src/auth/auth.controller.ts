import { Request, Response, Router } from "express";
import {
  blockNotAuthenticated,
  blockNotVerifiedUser,
} from "../middlewares/auth.middlewares.js";
import { UserService } from "@/user/user.service.js";

export class AuthController {
  public readonly router = Router();

  // Constructor initialization of routes
  constructor(private readonly userService: UserService) {
    this.router.get(
      "/auth/me",
      blockNotAuthenticated,
      blockNotVerifiedUser,
      this.getMe.bind(this)
    );
  }

  async getMe(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({
        errors: [{ message: "Not found session" }],
      });
    }
    console.log(req.session.user);

    try {
      const user = await this.userService.getUserById(req.session.user.id);
      if (!user) {
        return res.status(401).send({
          errors: [{ message: "Not found user" }],
        });
      }
      return res.status(200).send({
        data: {
          ...user,
          password: undefined,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal server error" }],
      });
    }
  }
}
