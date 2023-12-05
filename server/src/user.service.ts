import { isValid } from "zod";
import { pool } from "./database";

export type User = {
	user_id: number;
	username: string;
	email: string;
	password: string;
	isVerified: boolean;
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

// getUserByIsVerified ?? 
export const getUserByIsVerified = async (user_id: number) => {
	const result = await pool.query(`SELECT isVerified FROM users WHERE user_id = $1`, [
		user_id,
	]);

	return result.rows.length ? (result.rows[0] as User) : null;
	// return result.rows[0] as { isVerified: boolean, user_id: number };
	// return result.rows.length ? (result.rows[0] as { isVerified: boolean; user_id: number }) : null;
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


export const changeVerifyEmail = async (user_id: number, isVerified: boolean) => {
	const result = await pool.query(
		`UPDATE users SET isVerified = $2 WHERE user_id = $1 RETURNING isVerified;`,
		[user_id, isVerified], 
	);
	return result.rows[0] as { isVerified: boolean, user_id: number };
};