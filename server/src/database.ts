import pg from "pg";
import { config } from "./config";

export const pool = new pg.Pool({
	connectionString: config.DB_CONNECTION_URI,
});

try {
	await pool.connect();
	await pool.query(`
		CREATE TABLE IF NOT EXISTS users (
			user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			username VARCHAR(200) NOT NULL,
			email VARCHAR(200) NOT NULL UNIQUE,
			password VARCHAR(200) NOT NULL,
			is_verified BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
		);
		
		CREATE TABLE IF NOT EXISTS user_sessions (
			session_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id uuid NOT NULL,
			FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS user_activation (
			user_id uuid NOT NULL UNIQUE,
			activation_token uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
		);
	`);

	console.log("Successfully connected to the database and created tables!");
} catch (error) {
	console.error("Failed to connect to the database!", error);
}
