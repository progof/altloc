import { Config } from "../../config";
import { db } from "../../db";
import {
  googleAccountsTable,
  usersTable,
} from "../../../db/schema"; 
import { eq } from "drizzle-orm";

export class AuthPasswordService {
  constructor(private readonly config: Config) {}

  async getGoogleAccountByGoogleId(googleId: string) {
    const [googleAccount] = await db.select().from(googleAccountsTable)
      .where(eq(googleAccountsTable.googleId, googleId));
    return googleAccount || null;
  }
}