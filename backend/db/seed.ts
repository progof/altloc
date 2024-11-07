import { drizzle } from "drizzle-orm/postgres-js";
import { z } from "zod";
import * as schema from "./schema.js";
import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config();

const env = z
	.object({
		DB_CONNECTION_URI: z.string().url(),
		ADMIN_EMAILS: z
			.string()
			.transform((value) => {
				return value.split(",").filter((maybeEmail) => {
					const result = z.string().email().safeParse(maybeEmail);

					if (!result.success) {
						console.warn("Skipping invalid email:", maybeEmail);
						return false;
					}

					return true;
				});
			})
			.optional(),
	})
	.parse(process.env);

const sql = postgres(env.DB_CONNECTION_URI, { max: 1 });
const db = drizzle(sql, { schema });



if (env.ADMIN_EMAILS) {
	await Promise.all(
		env.ADMIN_EMAILS.map(async (email) => {
			try {
				await db.insert(schema.adminsTable).values({ email });

				console.log("Created admin:", email);
			} catch (error) {
				if (error instanceof postgres.PostgresError && error.code === "23505") {
					console.warn("Admin already exists:", email);
					return;
				}
				console.error(error);
			}
		}),
	);
}

await sql.end({ timeout: 1 });