import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { pool } from "./database";

import { AuthService } from "./auth/auth.service";
import { AuthController } from "./auth/auth.controller";

import { NotesController } from "./notes/notes.controller";
import { NotesService } from "./notes/notes.service";

import { SpacesController } from "./spaces/spaces.controller";
import { SpacesService } from "./spaces/spaces.service";

import { PostsController } from "./posts/posts.controller";
import { PostsService } from "./posts/posts.service";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

export const authService = new AuthService(config, pool);
const authController = new AuthController(authService);
app.use(authController.router);

export const notesService = new NotesService(pool);
const notesController = new NotesController(notesService);
app.use(notesController.router);

export const postsService = new PostsService(pool);
const postsController = new PostsController(postsService);
app.use(postsController.router);

export const spacesService = new SpacesService(pool);
const spacesController = new SpacesController(spacesService);
app.use(spacesController.router);

app.listen(config.APP_PORT, () => {
  console.log(`Server running on port ${config.APP_PORT}`);
});
