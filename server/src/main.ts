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


import { EventsController } from "./events/events.controller";
import { EventsService } from "./events/events.service";

// Create an instance of the Express application
const app = express();
// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(cookieParser()); // Parse cookies attached to the client's request
app.use(express.json()); // Parse incoming request bodies in JSON format

// Configure session middleware
app.use(
  session({
    secret: config.SESSION_SECRET, // Secret used to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't save uninitialized sessions
  }),
);

// Initialize services with database pool and configuration for authService
export const authService = new AuthService(config, pool);
const authController = new AuthController(authService);
// Mount authentication routes onto the Express application
app.use(authController.router);

// Initialize services with database pool and configuration for NotesService
export const notesService = new NotesService(pool);
const notesController = new NotesController(notesService);
// Mount route for notes onto the Express application
app.use(notesController.router);

// Initialize services with database pool and configuration for PostsService
export const postsService = new PostsService(pool);
const postsController = new PostsController(postsService);
// Mount route for posts onto the Express application
app.use(postsController.router);

// Initialize services with database pool and configuration for SpacesService
export const spacesService = new SpacesService(pool);
const spacesController = new SpacesController(spacesService);
// Mount route for spaces onto the Express application
app.use(spacesController.router);


// Initialize services with database pool and configuration for PostsService
export const eventsService = new EventsService(pool);
const eventsController = new EventsController(eventsService);
// Mount route for posts onto the Express application
app.use(eventsController.router);

// Start the Express server, listening on the specified port
app.listen(config.APP_PORT, () => {
  console.log(`Server running on port ${config.APP_PORT}`);
});
