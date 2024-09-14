import {
	drizzle,
	type PostgresJsQueryResultHKT,
} from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@db/schema.js";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { config } from "@/config.js";

const sql = postgres(config.DB_CONNECTION_URI);
export const db = drizzle(sql, { schema });

(async () => {
	try {
		await sql`SELECT 1`;
		console.log("Connected to the database!");
	} catch (error) {
		console.error("Failed to connect to the database:", error);
		process.exit(1);
	}
})();

export type Transaction = PgTransaction<
	PostgresJsQueryResultHKT,
	typeof db._.fullSchema,
	ExtractTablesWithRelations<typeof db._.fullSchema>
>;
