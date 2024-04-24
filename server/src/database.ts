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

/**
 * Definition of the Post object.
 */
export type Post = {
	post_id: string;
	user_id: string;
	title: string;
	content: string;
	created_at: string;
	likes: number;
	edit_at: string;
};

/**
 * Definition of the LikesOfUsers object.
 */
export type LikesOfUsers = {
	post_id: string;
	user_id: string;
  };

/**
 * Definition of the University object.
 */
export type University = {
	university_id: string;
	fullname: string;
	shortname: string;
	country: string; 
	city: string;
  	description: string;
	created_at: string;
	edit_at: string;
};

/**
 * Definition of the Note object.
 */
export type Note = {
  note_id: string;
  user_id: string;
  title: string;
  description: string;
  body: string;
  category: string;
  created_at: string;
  edit_at: string;
};


/**
 * Definition of the Space object.
 */
export type Space = {
	space_id: string;
	university_id: string;
	owner: string;
	members: string;
	title: string;
	country: string; 
	city: string;
	university: string;
	category: string;
	description: string;
	created_at: string;
	edit_at: string;
  };

/**
 * Definition of the SpaceMembers object.
 */
export type SpaceMembers = {
	member_id: string;
	space_id: string;
	user_id: string;
	username: string;
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
			password VARCHAR(200) NOT NULL,
			is_verified BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
			role VARCHAR(50) DEFAULT 'USER' 
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

		CREATE TABLE IF NOT EXISTS posts (
			post_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id uuid NOT NULL,
			title VARCHAR(50) NOT NULL,
			content VARCHAR(10000) NOT NULL,
			likes INTEGER NOT NULL DEFAULT 0,
			created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
			edit_at VARCHAR(200),
			FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS likes_posts (
			post_id uuid NOT NULL,
			user_id uuid NOT NULL,
			FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
			FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS universities (
			university_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			fullname VARCHAR(200) NOT NULL,
			shortname VARCHAR(200) NOT NULL,
			country VARCHAR(200) NOT NULL,
			city VARCHAR(200) NOT NULL,
			description VARCHAR(500) NOT NULL,
			created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
			edit_at VARCHAR(200)
		);

		CREATE TABLE IF NOT EXISTS spaces (
			space_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id uuid NOT NULL,
			university_id uuid,
			title VARCHAR(200) NOT NULL,
			country VARCHAR(200) NOT NULL,
			city VARCHAR(200) NOT NULL,
			university VARCHAR(200) NOT NULL,
			category VARCHAR(200) NOT NULL,
			description VARCHAR(500) NOT NULL,
			created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
			edit_at VARCHAR(200),
			FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
			FOREIGN KEY (university_id) REFERENCES universities(university_id) ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS notes (
			note_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			space_id uuid NOT NULL,
			user_id uuid NOT NULL,
			title VARCHAR(200) NOT NULL,
			description VARCHAR(500) NOT NULL,
			body VARCHAR(10000) NOT NULL,
			category VARCHAR(200) NOT NULL,
			created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
			edit_at VARCHAR(200),
			FOREIGN KEY (space_id) REFERENCES spaces(space_id) ON DELETE CASCADE,
			FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS spaces_members (
			member_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id uuid NOT NULL,
			space_id uuid NOT NULL,
			FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
			FOREIGN KEY (space_id) REFERENCES spaces(space_id) ON DELETE CASCADE
		);

	`);
// changed table.space university_id
	/**
  	 * Log successful database connection and table creation.
   	*/
  	console.log("Successfully connected to the database and created tables!");
} catch (error) {
	/**
   	* Log error if failed to connect or create tables.
   	*/
	console.error("Failed to connect to the database!", error);
}
