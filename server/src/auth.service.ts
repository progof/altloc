import { pool } from "./database";
import { config } from "./config";
import jwt from "jsonwebtoken";

// Helper functions to generate tokens
export const generateAccessToken = (payload: { userId: number }) => {
	return jwt.sign(payload, config.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
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
