// import { z } from "zod";
// import { UserService } from "./user.service";
// import { Request, Response, Router } from "express";
// import { blockNotVerifedUser } from "@/middlewares/auth.middlewares";
// import { AuthPasswordService } from "../auth/password/auth.password.service";
// import { Config } from "../config";
// import { db } from "@/db";

// export class UserController {
//     public readonly router = Router();
//     private authPasswordService: AuthPasswordService;
  
//     constructor(
//       private readonly userService: UserService,
//       private readonly config: Config,
//     ) {
//       this.router.use("/user/settings", blockNotVerifedUser);
//       this.router.patch("/user/settings", this.changeEmailForUser.bind(this));
      
//       // this.authPasswordService = new AuthPasswordService(db, );
//     }
//   async changeEmailForUser(req: Request, res: Response) {
//     if (!req.session.user) {
//       return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
//     }
//     const userId = req.session.user.user_id;
//     const bodySchema = z.object({
//         email: z.string().email(),
//     });
  
//     const body = bodySchema.safeParse(req.body);
//     if (!body.success) {
//       return res.status(400).send({
//         errors: body.error.issues,
//       });
//     }

//     const existingUser = await this.authPasswordService.getUserByEmail(body.data.email);
//     if (existingUser) {
//       return res
//         .status(400)
//         .send({ errors: [{ message: "Email already registered" }] });
//     }

//     try {
//       const changeEmail = await this.userService.(userId, body.data.email);
//       return res.status(201).send({ data: changeEmail });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).send({
//         errors: [{ message: "Internal Server Error" }],
//       });
//     }
//   }

// }