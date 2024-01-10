import "express-session";
import { User } from "./src/users/user.service";

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}
