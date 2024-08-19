import "express-session";
import { User } from "@db/schema";

declare module "express-session" {
  interface SessionData {
    // user: import("@db/schema").User;
    user: User;
  }
}

