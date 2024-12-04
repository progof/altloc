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

  // async getMe(req: Request, res: Response) {
  //   if (!req.session.user) {
  //     return res.status(401).send({
  //       errors: [{ message: "Not found session" }],
  //     });
  //   }
  //   console.log(req.session.user);

  //   try {
  //     const user = await this.userService.getUserById(req.session.user.id);
  //     if (!user) {
  //       return res.status(401).send({
  //         errors: [{ message: "Not found user" }],
  //       });
  //     }

  //     console.log("Debug:", user);
  //     return res.status(200).send({
  //       data: {
  //         ...user,
  //         password: undefined,
  //       },
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).send({
  //       errors: [{ message: "Internal server error" }],
  //     });
  //   }
  // }

  async getMe(req: Request, res: Response) {
    if (!req.session.user) {
      console.error("Session not found");
      return res.status(401).send({
        errors: [{ message: "Not found session" }],
      });
    }

    console.log("Session user:", req.session.user);

    try {
      console.log("Fetching user with ID:", req.session.user.id);
      const user = await this.userService.getUserById(req.session.user.id);

      if (!user) {
        console.error("User not found for ID:", req.session.user.id);
        return res.status(401).send({
          errors: [{ message: "Not found user" }],
        });
      }

      console.log("Fetched user:", user);

      return res.status(200).send({
        data: {
          ...user,
          password: undefined, // Защита от утечки пароля
        },
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).send({
        errors: [{ message: "Internal server error" }],
      });
    }
  }
}
