import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "@/config";  
import { s3} from "@/s3";
import { google } from "@/oauth";

import { AuthPasswordService } from "./auth/password/auth.password.service";  
import { AuthPasswordController } from "./auth/password/auth.password.controller";

import { DayQuestController } from "@/dayquest/dayquest.controller";
import { TasksService } from "@/dayquest/task.service";
import { CategoriesService } from "@/dayquest/category.service";
import { CommentsService } from "@/dayquest/comment.service";
import "@/dayquest/dayquest.cron";

import { AuthGoogleService } from "./auth/google/auth.google.service";  
import { AuthGoogleController } from "./auth/google/auth.google.controller";
import { db } from "./db";

const app = express();

app.use(
    cors({
        origin: config.CLIENT_URL,
        credentials: true, 
    })
);
app.use(cookieParser());
app.use(express.json());

app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } 
    })
);



export const authPasswordService = new AuthPasswordService(config);
const authPasswordController = new AuthPasswordController(authPasswordService);
app.use(authPasswordController.router);

export const authGoogleService = new AuthGoogleService(s3, config.MINIO_BUCKET, google, db);
const authGoogleController = new AuthGoogleController(authGoogleService, authPasswordService);
app.use(authGoogleController.router);


export const categoryService = new CategoriesService();
export const taskService = new TasksService();
export const commentService = new CommentsService();
const dayQuestController = new DayQuestController(taskService, categoryService, commentService);
app.use(dayQuestController.router);


app.listen(config.APP_PORT, () => {
    console.log(`Server running on port: ${config.APP_PORT}`);
});
