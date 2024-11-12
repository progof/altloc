import { createPagingObject, Database, Transaction, PagingObject, dateToUTCTimestamp } from "@/utils.js";
import { adminsTable, usersTable } from "@db/schema.js";
import { User } from "@shared/index.js";
import { z, ZodType } from "zod";
import { eq, count } from "drizzle-orm";


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

export const getUsersPageQuerySchema = z.object({
	pageSize: z.coerce.number().int().positive(),
	page: z.coerce.number().int().positive(),
});

export type GetUsersPageQuery = z.infer<typeof getUsersPageQuerySchema>;

export class AdminService {
    constructor() {}
   

    getUsersPage(
		db: Database | Transaction,
		options: GetUsersPageQuery,
	): Promise<PagingObject<User>> {
		const { page = 1, pageSize = 10 } = options;

		return db.transaction(async (tx) => {
			const [totalItems, users] = await Promise.all([
				tx
					.select({ count: count() })
					.from(usersTable)
					.then((result) => result.at(0)?.count || 0),
				tx
					.select()
					.from(usersTable)
					.leftJoin(adminsTable, eq(usersTable.email, adminsTable.email))
					.limit(pageSize)
					.offset((page - 1) * pageSize),
			]);

			return createPagingObject({
				items: users.map((user) => ({
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
				})),
				page,
				pageSize,
				totalItems,
			});
		});
	}

}