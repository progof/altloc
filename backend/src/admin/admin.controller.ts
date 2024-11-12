import { Request, Response, Router } from "express";
import { db } from "@/db.js";

import { AdminService, getUsersPageQuerySchema } from "./admin.service.js";
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

    // public async getAllUsers(req: Request, res: Response) {
    //     try {
    //         const users = await this.adminService.getAllUsers(db);
        
    //         return res.status(200).send({ users });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send({ errors: [{ message: "Internal server error" }] });
    //     }
    // }

    public async getAllUsers(req: Request, res: Response) {
      try {
          // Проверка и преобразование query параметров
          const queryResult = getUsersPageQuerySchema.safeParse(req.query);
  
          if (!queryResult.success) {
              return res.status(400).json({ errors: queryResult.error.format() });
          }
  
          const users = await this.adminService.getUsersPage(db, queryResult.data);
          console.log(users);
          return res.status(200).json( users );
      } catch (error) {
          console.error(error);
          res.status(500).json({ errors: [{ message: "Internal server error" }] });
      }
  }
  
    

}