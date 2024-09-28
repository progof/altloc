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
} from "../../../db/schema.js";
import { eq } from "drizzle-orm";

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

	async getUserById(userId: string) {
		const [user] = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, userId));
		return user || null;
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
