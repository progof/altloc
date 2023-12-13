import { pool } from "../database";
import { config } from "../config";
import jwt from "jsonwebtoken";

// Helper functions to generate tokens
export const generateAccessToken = (payload: { userId: string }) => {
	return jwt.sign(payload, config.ACCESS_TOKEN_SECRET, { expiresIn: "15min" });
};

export function generateRefreshToken(payload: {
	userId: string;
	sessionId: string;
}) {
	return jwt.sign(payload, config.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
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

export const createSession = async (userId: string) => {
	const result = await pool.query(
		`INSERT INTO user_sessions (user_id) VALUES ($1) RETURNING session_id;`,
		[userId]
	);
	return result.rows[0] as { session_id: string };
};
export const deleteSession = async (sessionId: string) => {
	await pool.query(`DELETE FROM user_sessions WHERE session_id = $1;`, [
		sessionId,
	]);
};
export const getSessionById = async (sessionId: string) => {
	const result = await pool.query(
		`SELECT * from user_sessions WHERE session_id = $1;`,
		[sessionId]
	);
	return result.rows[0] as { session_id: string; user_id: string };
};

export const getUserActivationById = async (user_id: string) => {
	const result = await pool.query(
		`SELECT * FROM user_activation WHERE user_id = $1;`,
		[user_id]
	);
	return result.rows[0] as {
		user_id: string;
		activation_token: string;
	};
};

export const getActivationTokenForUser = async (user_id: string) => {
	const result = await pool.query(
		`INSERT INTO user_activation (user_id) VALUES ($1)
		ON CONFLICT (user_id) DO NOTHING RETURNING *;`,
		[user_id]
	);
	return result.rows[0] as {
		activation_token: string;
		user_id: string;
		created_at: string;
	};
};
