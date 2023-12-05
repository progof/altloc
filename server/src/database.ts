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
			password VARCHAR(200) NOT NULL,
			isVerified BOOLEAN DEFAULT FALSE
		);
		
		CREATE TABLE IF NOT EXISTS user_sessions (
			session_id BIGSERIAL PRIMARY KEY NOT NULL,
			user_id INTEGER NOT NULL
		);

		CREATE TABLE IF NOT EXISTS user_activation (
			activation_id BIGSERIAL PRIMARY KEY NOT NULL,
			user_id INTEGER NOT NULL,
			activation_token VARCHAR(200) NOT NULL UNIQUE
		);
	`);

	console.log("Successfully connected to the database and created tables!");
} catch (error) {
	console.error("Failed to connect to the database!", error);
}
