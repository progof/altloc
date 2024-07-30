import "express-session";

declare module "express-session" {
  interface SessionData {
    user: import("@db/schema").User;
  }
}

