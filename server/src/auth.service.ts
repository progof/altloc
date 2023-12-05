import { pool } from "./database";
import { config } from "./config";
import jwt from "jsonwebtoken";

// Helper functions to generate tokens
export const generateAccessToken = (payload: { userId: number }) => {
	return jwt.sign(payload, config.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
};

export function generateRefreshToken(payload: {
	userId: number;
	sessionId: number;
}) {
	return jwt.sign(payload, config.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

// Function to get the refresh token for a user
export const getRefreshToken = async (userId: number) => {
	try {
		const result = await pool.query(
			`SELECT token FROM refresh_tokens WHERE user_id = $1;`,
			[userId]
		);
		return result.rows[0]?.token || null;
	} catch (error) {
		console.error("Error getting refresh token:", error);
		return null;
	}
};

export const createSession = async (userId: number) => {
	const result = await pool.query(
		`INSERT INTO user_sessions (user_id) VALUES ($1) RETURNING session_id;`,
		[userId]
	);
	return result.rows[0] as { session_id: number };
};
export const deleteSession = async (sessionId: number) => {
	await pool.query(`DELETE FROM user_sessions WHERE session_id = $1;`, [
		sessionId,
	]);
};
export const getSessionById = async (sessionId: number) => {
	const result = await pool.query(
		`SELECT * from user_sessions WHERE session_id = $1;`,
		[sessionId]
	);
	return result.rows[0] as { session_id: number; user_id: number };
};

export const getUserActivationById = async (user_id: number) => {
	const result = await pool.query(
		`SELECT * FROM user_activation WHERE user_id = $1 ORDER BY activation_id DESC LIMIT 1;`,
		[user_id]
	);
	return result.rows[0] as { activation_id: number; user_id: number; activation_token: string };
};

export const setActivationToken = async (user_id: number, activation_token: string) => {
	const result = await pool.query(
		`INSERT INTO user_activation (user_id, activation_token) VALUES ($1, $2) RETURNING activation_id;`,
		[user_id, activation_token], 
	);
	return result.rows[0] as { activation_id: number };
};

