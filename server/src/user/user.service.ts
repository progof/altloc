import type { Pool } from "pg";
import { User} from "../database";


export class UserService {
  constructor(private readonly db: Pool) {}

  async changeEmail(
    userId: string,
    newEmail: string,
  ) {
    const result = await this.db.query<User>(`UPDATE users SET email = $2 WHERE user_id = $1;`, [
      userId,
      newEmail,
    ]);
    return result.rows[0] as User;
  }

}