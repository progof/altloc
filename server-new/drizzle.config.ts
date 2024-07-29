import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import { config } from "./src/config";


dotenv.config();

export default defineConfig({
	schema: "./db/schema.ts",
	out: "./db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: config.DB_CONNECTION_URI!,
	},
	extensionsFilters: ["postgis"],
	verbose: true,
});
