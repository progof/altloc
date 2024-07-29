import pg from "pg";
import { config } from "./config";

/**
 * Create a pool for managing PostgreSQL connections.
 */
export const pool = new pg.Pool({
  connectionString: config.DB_CONNECTION_URI,
});

/**
 * Definition of the User object.
 */
export type User = {
  user_id: string;
  username: string;
  email: string;
  password: string;
  is_verified: boolean;
  created_at: string;
  role: string;
};

export type PasswoedAccounts = {
	user_id: string;
	password: string;
};

/**
 * Definition of the UserSession object.
 */
export type UserSession = {
  session_id: string;
  user_id: string;
  user_role: string;
};

/**
 * Definition of the EmailActivation object.
 */
export type EmailActivation = {
  user_id: string;
  activation_token: string;
  created_at: string;
};

/**
 * Definition of the ResetPasswordRequest object.
 */
export type ResetPasswordRequest = {
  user_id: string;
  reset_token: string;
  created_at: string;
};




try {
	//  Attempt to connect to the PostgreSQL database.
	await pool.connect();

   /**
   * Create necessary database tables if they don't exist already.
   */
  await pool.query(`
		CREATE TABLE IF NOT EXISTS users (
			user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			username VARCHAR(200) NOT NULL,
			email VARCHAR(200) NOT NULL UNIQUE,
			is_verified BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
			role VARCHAR(50) DEFAULT 'USER' 
		);

		CREATE TABLE IF NOT EXISTS password_accounts (
			user_id uuid NOT NULL,
			password VARCHAR(255) NOT NULL,
			FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
		);
		
		CREATE TABLE IF NOT EXISTS user_sessions (
			session_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id uuid NOT NULL,
			user_role VARCHAR(50) NOT NULL,
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

	`);

  	console.log("Successfully connected to the database and created tables!");
} catch (error) {
	/**
   	* Log error if failed to connect or create tables.
   	*/
	console.error("Failed to connect to the database!", error);
}
