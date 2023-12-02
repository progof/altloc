import pg from "pg";
import { config } from "./config";

export const pool = new pg.Pool({
	connectionString: config.DB_CONNECTION_URI,
});

try {
	await pool.connect();
	await pool.query(`
		CREATE TABLE IF NOT EXISTS users (
			user_id BIGSERIAL PRIMARY KEY NOT NULL,
			username VARCHAR(200) NOT NULL,
			email VARCHAR(200) NOT NULL UNIQUE,
			password VARCHAR(200) NOT NULL
		);
		
		CREATE TABLE IF NOT EXISTS user_sessions (
			session_id BIGSERIAL PRIMARY KEY NOT NULL,
			user_id INTEGER NOT NULL
		);
	`);

	console.log("Successfully connected to the database");
} catch (error) {
	console.error("Failed to connect to the database", error);
}
