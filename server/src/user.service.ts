import { pool } from "./database";

export type User = {
	user_id: number;
	username: string;
	email: string;
	password: string;
};

export const getUserById = async (userId: number) => {
	const result = await pool.query(`SELECT * FROM users WHERE user_id = $1;`, [
		userId,
	]);
	if (result.rows.length === 0) {
		return null;
	}
	return result.rows.length ? (result.rows[0] as User) : null;
};

export const getUserByEmail = async (email: string) => {
	const result = await pool.query(`SELECT * FROM users WHERE email = $1;`, [
		email,
	]);

	return result.rows.length ? (result.rows[0] as User) : null;
};

export const createUser = async (data: {
	username: string;
	email: string;
	hashedPassword: string;
}) => {
	const { email, hashedPassword, username } = data;
	const result = await pool.query(
		`INSERT INTO users (username, email, password)
			VALUES ($1, $2, $3)
			RETURNING user_id`,
		[username, email, hashedPassword]
	);
	return result.rows[0] as { user_id: number };
};
