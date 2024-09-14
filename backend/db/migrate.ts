import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import { config } from "../src/config.js";

const sql = postgres(config.DB_CONNECTION_URI, { max: 1 });
const db = drizzle(sql, { schema });

await migrate(db, { migrationsFolder: "db/migrations" });
await sql.end({ timeout: 1 });

console.log("Migrations ran successfully!");
