import "express-session";
import { User } from "./src/user/user.service";

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}
