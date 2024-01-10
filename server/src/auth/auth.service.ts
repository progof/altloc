import {
  EmailActivation,
  ResetPasswordRequest,
  User,
  UserSession,
} from "../database";
import jwt from "jsonwebtoken";
import type { Pool } from "pg";
import { Config } from "../config";

export class AuthService {
  constructor(private readonly config: Config, private readonly db: Pool) {}

  generateAccessToken(payload: { userId: string }) {
    return jwt.sign(payload, this.config.ACCESS_TOKEN_SECRET, {
      expiresIn: "15min",
    });
  }

  generateRefreshToken(payload: {
    userId: string;
    sessionId: string;
  }) {
    return jwt.sign(payload, this.config.REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });
  }

  async createSession(userId: string) {
    const result = await this.db.query<UserSession>(
      `INSERT INTO user_sessions (user_id) VALUES ($1) RETURNING *;`,
      [userId],
    );
    return result.rows[0]!;
  }

  async deleteSession(sessionId: string) {
    await this.db.query(`DELETE FROM user_sessions WHERE session_id = $1;`, [
      sessionId,
    ]);
  }

  async getSessionById(sessionId: string) {
    const result = await this.db.query<UserSession>(
      `SELECT * from user_sessions WHERE session_id = $1;`,
      [sessionId],
    );
    return result.rows[0] || null;
  }

  async getUserActivationById(userId: string) {
    const result = await this.db.query(
      `SELECT * FROM email_activations WHERE user_id = $1;`,
      [userId],
    );
    return result.rows[0] as {
      user_id: string;
      activation_token: string;
    };
  }

  async createOrGetEmailActivation(userId: string) {
    const result = await this.db.query<EmailActivation>(
      `INSERT INTO email_activations (user_id) VALUES ($1)
			ON CONFLICT (user_id) DO NOTHING RETURNING *;`,
      [userId],
    );
    return result.rows[0]!;
  }

  async deleteUserActivationToken(userId: string) {
    await this.db.query(`DELETE FROM email_activations WHERE user_id = $1`, [
      userId,
    ]);
  }

  async getResetPasswordRequest(userId: string) {
    const result = await this.db.query<ResetPasswordRequest>(
      `SELECT * FROM reset_password_requests WHERE user_id = $1;`,
      [userId],
    );
    return result.rows[0] || null;
  }

  async createOrGetResetPasswordRequest(userId: string) {
    const result = await this.db.query<ResetPasswordRequest>(
      `INSERT INTO reset_password_requests (user_id) VALUES ($1)
			ON CONFLICT (user_id) DO NOTHING RETURNING *;`,
      [userId],
    );
    return result.rows[0]!;
  }

  async deleteUserResetPasswordRequest(userId: string) {
    await this.db.query(
      `DELETE FROM reset_password_requests WHERE user_id = $1`,
      [
        userId,
      ],
    );
  }

  async getUserById(userId: string) {
    const result = await this.db.query<User>(
      `SELECT * FROM users WHERE user_id = $1;`,
      [
        userId,
      ],
    );
    return result.rows.at(0) || null;
  }

  async getUserByEmail(email: string) {
    const result = await this.db.query<User>(
      `SELECT * FROM users WHERE email = $1;`,
      [
        email,
      ],
    );

    return result.rows.at(0) || null;
  }

  async createUser(data: {
    username: string;
    email: string;
    hashedPassword: string;
  }) {
    const { email, hashedPassword, username } = data;
    const result = await this.db.query(
      `INSERT INTO users (username, email, password)
			VALUES ($1, $2, $3)
			RETURNING user_id`,
      [username, email, hashedPassword],
    );
    return result.rows[0] as { user_id: string };
  }

  async changeEmailVerificationStatus(
    userId: string,
    isVerified: boolean,
  ) {
    await this.db.query(
      `UPDATE users SET is_verified = $2 WHERE user_id = $1;`,
      [
        userId,
        isVerified,
      ],
    );
  }

  async changePassword(
    userId: string,
    newPassword: string,
  ) {
    await this.db.query(`UPDATE users SET password = $2 WHERE user_id = $1;`, [
      userId,
      newPassword,
    ]);
  }
}
