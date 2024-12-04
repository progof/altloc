import jwt from "jsonwebtoken";
import { Config } from "../../config.js";
import { db } from "../../db.js";
import {
  emailActivationsTable,
  resetPasswordRequestsTable,
  usersTable,
  userSessionsTable,
  passwordAccountsTable,
  PasswordAccount,
  adminsTable,
  googleAccountsTable,
} from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { HTTPError, dateToUTCTimestamp } from "@/utils.js";
import { User } from "@shared/index.js";
import { z, ZodType } from "zod";

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
  authMethods: z.array(z.union([z.literal("password"), z.literal("google")])),
}) satisfies ZodType<User>;

export class AuthPasswordService {
  constructor(private readonly config: Config) {}

  generateAccessToken(payload: { userId: string; role: string }) {
    return jwt.sign(payload, this.config.ACCESS_TOKEN_SECRET, {
      expiresIn: "15min",
    });
  }

  generateRefreshToken(payload: {
    userId: string;
    sessionId: string;
    role: string;
  }) {
    return jwt.sign(payload, this.config.REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });
  }

  async createSession(userId: string, role: string) {
    const [session] = await db
      .insert(userSessionsTable)
      .values({ userId, userRole: role })
      .returning();
    if (!session) {
      throw new Error("Failed to create session");
    }
    return session;
  }

  async deleteSession(sessionId: string) {
    await db
      .delete(userSessionsTable)
      .where(eq(userSessionsTable.sessionId, sessionId));
  }

  async getSessionById(sessionId: string) {
    const [session] = await db
      .select()
      .from(userSessionsTable)
      .where(eq(userSessionsTable.sessionId, sessionId));
    return session || null;
  }

  async getUserActivationById(userId: string) {
    const [activation] = await db
      .select()
      .from(emailActivationsTable)
      .where(eq(emailActivationsTable.userId, userId));
    return activation || null;
  }

  async createOrGetEmailActivation(userId: string) {
    const [activation] = await db
      .insert(emailActivationsTable)
      .values({ userId })
      .onConflictDoNothing()
      .returning();
    return activation;
  }

  async deleteUserActivationToken(userId: string) {
    await db
      .delete(emailActivationsTable)
      .where(eq(emailActivationsTable.userId, userId));
  }

  async getResetPasswordRequest(userId: string) {
    const [request] = await db
      .select()
      .from(resetPasswordRequestsTable)
      .where(eq(resetPasswordRequestsTable.userId, userId));
    return request || null;
  }

  async createOrGetResetPasswordRequest(userId: string) {
    const [request] = await db
      .insert(resetPasswordRequestsTable)
      .values({ userId })
      .onConflictDoNothing()
      .returning();
    return request;
  }

  async deleteUserResetPasswordRequest(userId: string) {
    await db
      .delete(resetPasswordRequestsTable)
      .where(eq(resetPasswordRequestsTable.userId, userId));
  }

  async getUserById(userId: string): Promise<User> {
    console.log("getUserById password");
    const user = (
      await db
        .select()
        .from(usersTable)
        .leftJoin(adminsTable, eq(usersTable.email, adminsTable.email))
        .leftJoin(
          googleAccountsTable,
          eq(usersTable.id, googleAccountsTable.userId)
        )
        .leftJoin(
          passwordAccountsTable,
          eq(usersTable.id, passwordAccountsTable.userId)
        )
        .where(eq(usersTable.id, userId))
    ).at(0);

    if (!user) {
      throw new HTTPError({ status: 404, message: "User not found" });
    }

    console.log("UserDATA getUserById:", user);

    console.log("Google Accounts:", user.google_accounts);
    console.log("Password Accounts:", user.password_accounts);

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
      authMethods: [
        user.google_accounts ? "google" : null,
        user.password_accounts ? "password" : null,
      ].filter((method) => method !== null) as Array<"password" | "google">,
    } satisfies User);
  }

  async getUserRoleById(userId: string) {
    const [user] = await db
      .select({ role: usersTable.role })
      .from(usersTable)
      .where(eq(usersTable.id, userId));
    return user?.role || null;
  }

  async getUserByEmail(email: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return user || null;
  }

  async getPasswordByUserId(userId: string): Promise<PasswordAccount | null> {
    const [password] = await db
      .select()
      .from(passwordAccountsTable)
      .where(eq(passwordAccountsTable.userId, userId));
    return password || null;
  }

  async createUser(data: { username: string; email: string }) {
    const { username, email } = data;
    const [user] = await db
      .insert(usersTable)
      .values({ username, email })
      .returning({
        id: usersTable.id,
      });
    return user;
  }

  async createPasswordAccount(data: {
    userId: string;
    hashedPassword: string;
  }) {
    const { userId, hashedPassword } = data;
    await db
      .insert(passwordAccountsTable)
      .values({ userId, password: hashedPassword });
  }

  async changeEmailVerificationStatus(userId: string, emailVerified: boolean) {
    await db
      .update(usersTable)
      .set({ emailVerified })
      .where(eq(usersTable.id, userId));
  }

  async changePassword(userId: string, newPassword: string) {
    await db
      .update(passwordAccountsTable)
      .set({ password: newPassword })
      .where(eq(passwordAccountsTable.userId, userId));
  }
}
