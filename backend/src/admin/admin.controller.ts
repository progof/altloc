import { Request, Response, Router } from "express";
import { db } from "@/db.js";

import { AdminService } from "./admin.service.js";
import { checkAdmin } from "@/middlewares/admin.middlewares.js";

export class AdminController {
  public readonly router = Router();

  // Constructor initialization of routes
  constructor(
    private readonly adminService: AdminService,
  ) {
    this.router.get(
      "/admin/users",
      checkAdmin,
      this.getAllUsers.bind(this)
    );

  }

    // Get all users with their details

    public async getAllUsers(req: Request, res: Response) {
        try {
            const users = await this.adminService.getAllUsers(db);
        
            return res.status(200).send({ users });
        } catch (error) {
            console.error(error);
            res.status(500).send({ errors: [{ message: "Internal server error" }] });
        }
    }
    

}