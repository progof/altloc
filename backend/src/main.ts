import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "@/config.js";
import { s3 } from "@/s3.js";
import { google } from "@/oauth.js";

import { AuthPasswordService } from "./auth/password/auth.password.service.js";
import { AuthPasswordController } from "./auth/password/auth.password.controller.js";

import { DayQuestController } from "@/dayquest/dayquest.controller.js";
import { TasksService } from "@/dayquest/task.service.js";
import { CategoriesService } from "@/dayquest/category.service.js";
import { CommentsService } from "@/dayquest/comment.service.js";
import "@/dayquest/dayquest.cron.js";

import { AuthGoogleService } from "./auth/google/auth.google.service.js";
import { AuthGoogleController } from "./auth/google/auth.google.controller.js";
import { db } from "./db.js";

const app = express();

app.use(
	cors({
		origin: config.CLIENT_URL,
		credentials: true,
		// allowedHeaders: [ "Accept-Version", "Authorization", "Credentials", "Content-Type" ],
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

export const authPasswordService = new AuthPasswordService(config);
const authPasswordController = new AuthPasswordController(authPasswordService);
app.use(authPasswordController.router);

export const authGoogleService = new AuthGoogleService(
	s3,
	config.MINIO_BUCKET,
	google,
	db
);
const authGoogleController = new AuthGoogleController(
	authGoogleService,
	authPasswordService
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

app.listen(config.APP_PORT, () => {
	console.log(`Server running on port: ${config.APP_PORT}`);
});
