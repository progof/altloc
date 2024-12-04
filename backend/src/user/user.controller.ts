import { z } from "zod";
import { UserService } from "./user.service.js";
import { Request, Response, Router } from "express";
import {
  blockNotAuthenticated,
  blockNotVerifiedUser,
} from "../middlewares/auth.middlewares.js";
import { db } from "@/db.js";
import multer from "multer";

// Настройка multer для обработки загруженных файлов
const upload = multer({
  limits: { fileSize: 4 * 1024 * 1024 }, // Максимальный размер файла 4MB
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback
  ) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("The file must be an image"));
    }
    callback(null, true);
  },
});

export class UserController {
  public readonly router = Router();

  constructor(private readonly userService: UserService) {
    this.router.patch(
      "/user/update",
      blockNotAuthenticated,
      blockNotVerifiedUser,
      upload.single("avatar"), // Обработка загруженного файла
      this.userUpdate.bind(this)
    );
  }

  // async userUpdate(req: Request, res: Response) {
  //   if (!req.session.user) {
  //     return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
  //   }

  //   console.log("userUpdate REQ", req.body);

  //   const userId = req.session.user.user_id;
  //   const bodySchema = z.object({
  //     username: z.string().min(1).max(255),
  //     avatar: z
  //       .instanceof(File)
  //       .refine((file) => file.size < 4 * 1024 * 1024, {
  //         message: "The image is too large, max size is 4 MB",
  //       })
  //       .refine((file) => file.type.startsWith("image/"), {
  //         message: "The file must be an image",
  //       })
  //       .optional(),
  //   });

  //   const body = bodySchema.safeParse(req.body);
  //   if (!body.success) {
  //     return res.status(400).send({
  //       errors: body.error.issues,
  //     });
  //   }

  //   console.log("Get data from fornend", body.data);

  //   try {
  //     const changeData = await this.userService.updateCurrentUser(db, userId, {
  //       username: body.data.username,
  //       avatar: body.data.avatar,
  //     });
  //     return res.status(201).send({ data: changeData });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).send({
  //       errors: [{ message: "Internal Server Error" }],
  //     });
  //   }
  // }

  async userUpdate(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
    }

    const userId = req.session.user.user_id;

    console.log("userUpdate REQ", req.body.username, req.file);

    // Проверка текста и извлечение файла
    const bodySchema = z.object({
      username: z.string().min(1).max(255),
    });

    const body = bodySchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).send({
        errors: body.error.issues,
      });
    }

    if (!req.file) {
      return res.status(400).send({
        errors: [{ message: "Avatar is required" }],
      });
    }

    try {
      const changeData = await this.userService.updateCurrentUser(db, userId, {
        username: body.data.username,
        avatar: req.file.buffer,
      });
      return res.status(201).send({ data: changeData });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }
}
