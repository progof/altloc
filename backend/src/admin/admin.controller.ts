import { Request, Response, Router } from "express";
import { db } from "@/db.js";

import { AdminService, getUsersPageQuerySchema } from "./admin.service.js";
import { checkAdmin } from "@/middlewares/admin.middlewares.js";
import { UserService } from "@/user/user.service.js";
import { z } from "zod";

export class AdminController {
  public readonly router = Router();

  // Constructor initialization of routes
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService
  ) {
    this.router.get("/admin/users", checkAdmin, this.getAllUsers.bind(this));
    this.router.get(
      "/admin/users/:userId",
      checkAdmin,
      this.fetchUserById.bind(this)
    );
  }

  public async getAllUsers(req: Request, res: Response) {
    try {
      // Проверка и преобразование query параметров
      const queryResult = getUsersPageQuerySchema.safeParse(req.query);

      if (!queryResult.success) {
        return res.status(400).json({ errors: queryResult.error.format() });
      }

      const users = await this.adminService.getUsersPage(db, queryResult.data);
      console.log(users);
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ errors: [{ message: "Internal server error" }] });
    }
  }

  public async fetchUserById(req: Request, res: Response) {
    const paramsSchema = z.object({
      userId: z.string().uuid(),
    });

    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({
        errors: params.error.issues,
      });
    }

    if (!params.data.userId) {
      return res.status(400).json({ errors: [{ message: "Invalid user id" }] });
    }

    try {
      const user = await this.userService.getUserById(params.data.userId);
      if (!user) {
        return res
          .status(404)
          .json({ errors: [{ message: "User not found" }] });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ errors: [{ message: "Internal server error" }] });
    }
  }
}
