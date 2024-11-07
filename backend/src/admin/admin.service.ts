import { dateToUTCTimestamp } from "@/utils.js";
import { adminsTable, usersTable } from "@db/schema.js";
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
}) satisfies ZodType<User>;

export class AdminService {
    constructor() {}

    async isAdminEmail(db: any, email: string): Promise<boolean> {
        const admin = await db
            .select(adminsTable)
            .where({ email })
            .single();
        return !!admin;
    }

    async getAllUsers(db: any): Promise<User[]> {
        const user = await db
            .select(usersTable)
            .all();
            return user.map((u: any) => userSchema.parse({
                id: u.id,
                username: u.username,
                email: u.email,
                emailVerified: u.emailVerified,
                avatarKey: u.avatarKey,
                createdAt: dateToUTCTimestamp(u.createdAt),
                role: u.role,
                score: u.score,
                level: u.level,
                currency: u.currency,
                isAdmin: u.isAdmin,
            } satisfies User));
    }

}