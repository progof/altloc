import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { NotesService } from "./notes/notes.service";
import { pool } from "./database";
import { AuthService } from "./auth/auth.service";
import { NotesController } from "./notes/notes.controller";
import { AuthController } from "./auth/auth.controller";

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

app.listen(config.APP_PORT, () => {
  console.log(`Server running on port ${config.APP_PORT}`);
});
