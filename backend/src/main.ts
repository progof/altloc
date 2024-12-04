import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "@/config.js";
import { s3 } from "@/s3.js";
import { google } from "@/oauth.js";

import { AuthPasswordService } from "./auth/password/password.service.js";
import { AuthPasswordController } from "./auth/password/password.controller.js";

import { AuthController } from "@/auth/auth.controller.js";

import { DayQuestController } from "@/dayquest/dayquest.controller.js";
import { TasksService } from "@/dayquest/task.service.js";
import { CategoriesService } from "@/dayquest/category.service.js";
import { CommentsService } from "@/dayquest/comment.service.js";

import { AuthGoogleService } from "./auth/google/google.service.js";
import { AuthGoogleController } from "./auth/google/google.controller.js";

import { AdminService } from "./admin/admin.service.js";
import { AdminController } from "./admin/admin.controller.js";

import { UserService } from "@/user/user.service.js";
import { UserController } from "@/user/user.controller.js";

import { db } from "./db.js";
import "../db/seed.js";

const app = express();

app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
    // allowedHeaders: [
    //   "Accept-Version",
    //   "Authorization",
    //   "Credentials",
    //   "Content-Type",
    // ],
  })
);
app.use(cookieParser());
app.use(express.json());

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

export const userService = new UserService(db);
const userController = new UserController(userService);
app.use(userController.router);

export const authPasswordService = new AuthPasswordService(config);
const authPasswordController = new AuthPasswordController(
  authPasswordService,
  userService
);
app.use(authPasswordController.router);

const authController = new AuthController(userService);
app.use(authController.router);

export const authGoogleService = new AuthGoogleService(
  s3,
  config.MINIO_BUCKET,
  google,
  db
);
const authGoogleController = new AuthGoogleController(
  authGoogleService,
  authPasswordService,
  userService
);
app.use(authGoogleController.router);

export const categoryService = new CategoriesService();
export const taskService = new TasksService();
export const commentService = new CommentsService();
const dayQuestController = new DayQuestController(
  taskService,
  categoryService,
  commentService
);
app.use(dayQuestController.router);

export const adminService = new AdminService();
const adminController = new AdminController(adminService, userService);
app.use(adminController.router);

app.listen(config.APP_PORT, () => {
  console.log(`Server running on port: ${config.APP_PORT}`);
});
