import { usersTable, adminsTable } from "@db/schema.js";
import { z, ZodType } from "zod";
// import {
// 	S3Client,
// } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { HTTPError, dateToUTCTimestamp } from "@/utils.js";
import { User } from "@shared/index.js";
import { db } from "@/db.js";

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  avatarKey: z.string().nullable(),
  createdAt: z.number(),
  role: z.string(),
  score: z.number(),
  level: z.number(),
  currency: z.number(),
  isAdmin: z.boolean(),
}) satisfies ZodType<User>;

export class UserService {
  constructor() {}

  async getUserById(userId: string): Promise<User> {
    const user = (
      await db
        .select()
        .from(usersTable)
        .leftJoin(adminsTable, eq(usersTable.email, adminsTable.email))
        .where(eq(usersTable.id, userId))
    ).at(0);

    if (!user) {
      throw new HTTPError({ status: 404, message: "User not found" });
    }

    return userSchema.parse({
      id: user.users.id,
      username: user.users.username,
      email: user.users.email,
      emailVerified: user.users.emailVerified,
      avatarKey: user.users.avatarKey,
      createdAt: dateToUTCTimestamp(user.users.createdAt),
      role: user.users.role,
      score: user.users.score,
      level: user.users.level,
      currency: user.users.currency,
      isAdmin: user.admins !== null,
    } satisfies User);
  }
}
