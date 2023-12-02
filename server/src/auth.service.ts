import { pool } from "./database";
import { User, getUserByEmail } from "./user.service";
import { config } from "./config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Helper functions to generate tokens
export const generateAccessToken = (payload: { userId: number }) => {
	return jwt.sign(payload, config.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export function generateRefreshToken(payload: { userId: number }) {
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

// Function to save a new refresh token for a user
export const saveRefreshToken = async (
	userId: number,
	refreshToken: string
) => {
	try {
		const result = await pool.query(
			`INSERT INTO refresh_tokens (user_id, token)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET token = $2;`,
			[userId, refreshToken]
		);
		console.log("Refresh token saved successfully:", result);
	} catch (error) {
		console.error("Error saving refresh token:", error);
	}
};
