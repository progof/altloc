// import "express-session";
// import { User } from "@db/schema";

// declare module "express-session" {
//   interface SessionData {
//     user: User & {
//       emailVerified: boolean;
//       role: string;
//     };
//   }
// }

import "express-session";
import type { User } from "@db/schema";

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

