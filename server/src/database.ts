import pg from "pg";
import { config } from "./config";

export const pool = new pg.Pool({
  connectionString: config.DB_CONNECTION_URI,
});

export type User = {
  user_id: string;
  username: string;
  email: string;
  password: string;
  is_verified: boolean;
  created_at: string;
};
export type UserSession = {
  session_id: string;
  user_id: string;
};
export type EmailActivation = {
  user_id: string;
  activation_token: string;
  created_at: string;
};
export type ResetPasswordRequest = {
  user_id: string;
  reset_token: string;
  created_at: string;
};
export type Note = {
  note_id: string;
  user_id: string;
  title: string;
  description: string;
  body: string;
  category: string;
  created_at: string;
};

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

		CREATE TABLE IF NOT EXISTS email_activations (
			user_id uuid NOT NULL UNIQUE,
			activation_token uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS reset_password_requests (
			user_id uuid NOT NULL UNIQUE,
			reset_token uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS notes (
			note_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id uuid NOT NULL,
			title VARCHAR(200) NOT NULL,
			description VARCHAR(500) NOT NULL,
			body VARCHAR(10000) NOT NULL,
			category VARCHAR(200) NOT NULL,
			created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
		);
	`);

  console.log("Successfully connected to the database and created tables!");
} catch (error) {
  console.error("Failed to connect to the database!", error);
}
