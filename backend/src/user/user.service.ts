// import type { Pool } from "pg";
// import {User} from "@db/schema";


// export class UserService {
//   constructor(private readonly db: Pool) {}


// //write get user by email use dzzle-orm


// async getUserByEmail(email: string) {
//   const result = await this.db.query<User>(`SELECT * FROM users WHERE email = $1;`, [email]);
//   return result.rows[0] as User;
// }

//   // async changeEmail(
//   //   userId: string,
//   //   newEmail: string,
//   // ) {
//   //   const result = await this.db.query<User>(`UPDATE users SET email = $2 WHERE user_id = $1;`, [
//   //     userId,
//   //     newEmail,
//   //   ]);
//   //   return result.rows[0] as User;
//   // }

// }