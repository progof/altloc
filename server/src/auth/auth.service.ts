/**
 * Import necessary modules and types.
 */
import {
  EmailActivation,
  ResetPasswordRequest,
  User,
  PasswoedAccounts,
  UserSession,
} from "../database";
import jwt from "jsonwebtoken";
import type { Pool } from "pg";
import { Config } from "../config";

/**
 * Class representing the authentication service.
 */
export class AuthService {
   /**
   * Constructs an instance of AuthService.
   * @param config Configuration object containing access token and refresh token secrets.
   * @param db PostgreSQL pool for database interactions.
   */
  constructor(private readonly config: Config, private readonly db: Pool) {}

  /**
   * Generates an access token.
   * @param payload Payload to be encoded in the token.
   * @returns Access token string.
   */
  generateAccessToken(payload: { userId: string, role: string }) {
    return jwt.sign(payload, this.config.ACCESS_TOKEN_SECRET, {
      expiresIn: "15min",
    });
  }

  /**
   * Generates a refresh token.
   * @param payload Payload to be encoded in the token.
   * @returns Refresh token string.
   */
  generateRefreshToken(payload: {
    userId: string;
    sessionId: string;
    role: string;
  }) {
    return jwt.sign(payload, this.config.REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });
  }

  /**
   * Creates a user session in the database.
   * @param userId ID of the user associated with the session.
   * @param role Role of the user.
   * @returns User session object.
   */
  async createSession(userId: string, role: string) {
    const result = await this.db.query<UserSession>(
      `INSERT INTO user_sessions (user_id, user_role) VALUES ($1, $2) RETURNING *;`,
      [userId, role],
    );
    return result.rows[0]!;
  }

  /**
   * Deletes a user session from the database.
   * @param sessionId ID of the session to be deleted.
   */
  async deleteSession(sessionId: string) {
    await this.db.query(`DELETE FROM user_sessions WHERE session_id = $1;`, [
      sessionId,
    ]);
  }

  /**
   * Retrieves a user session by session ID.
   * @param sessionId ID of the session to retrieve.
   * @returns User session object if found, otherwise null.
   */
  async getSessionById(sessionId: string) {
    const result = await this.db.query<UserSession>(
      `SELECT * from user_sessions WHERE session_id = $1;`,
      [sessionId],
    );
    return result.rows[0] || null;
  }

  /**
   * Retrieves email activation information by user ID.
   * @param userId ID of the user.
   * @returns Email activation object if found, otherwise null.
   */
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

  /**
   * Creates or retrieves an email activation for a user.
   * @param userId ID of the user.
   * @returns Email activation object.
   */
  async createOrGetEmailActivation(userId: string) {
    const result = await this.db.query<EmailActivation>(
      `INSERT INTO email_activations (user_id) VALUES ($1)
			ON CONFLICT (user_id) DO NOTHING RETURNING *;`,
      [userId],
    );
    return result.rows[0]!;
  }

  /**
   * Deletes the email activation token for a user.
   * @param userId ID of the user.
   */
  async deleteUserActivationToken(userId: string) {
    await this.db.query(`DELETE FROM email_activations WHERE user_id = $1`, [
      userId,
    ]);
  }

  /**
   * Retrieves the reset password request for a user by user ID.
   * @param userId ID of the user.
   * @returns Reset password request object if found, otherwise null.
   */
  async getResetPasswordRequest(userId: string) {
    const result = await this.db.query<ResetPasswordRequest>(
      `SELECT * FROM reset_password_requests WHERE user_id = $1;`,
      [userId],
    );
    return result.rows[0] || null;
  }

  /**
   * Creates or retrieves a reset password request for a user by user ID.
   * @param userId ID of the user.
   * @returns Reset password request object.
   */
  async createOrGetResetPasswordRequest(userId: string) {
    const result = await this.db.query<ResetPasswordRequest>(
      `INSERT INTO reset_password_requests (user_id) VALUES ($1)
			ON CONFLICT (user_id) DO NOTHING RETURNING *;`,
      [userId],
    );
    return result.rows[0]!;
  }

  /**
   * Deletes the reset password request for a user by user ID.
   * @param userId ID of the user.
   */
  async deleteUserResetPasswordRequest(userId: string) {
    await this.db.query(
      `DELETE FROM reset_password_requests WHERE user_id = $1`,
      [
        userId,
      ],
    );
  }

   /**
   * Retrieves a user by user ID.
   * @param userId ID of the user.
   * @returns User object if found, otherwise null.
   */
  async getUserById(userId: string) {
    const result = await this.db.query<User>(
      `SELECT * FROM users WHERE user_id = $1;`,
      [
        userId,
      ],
    );
    return result.rows.at(0) || null;
  }

  /**
   * Retrieves the role of a user by user ID.
   * @param userId ID of the user.
   * @returns User role if found, otherwise null.
   */
  async getUserRoleById(userId: string) {
    const result = await this.db.query<User>(
      `SELECT role FROM users WHERE user_id = $1;`,
      [
        userId,
      ],
    );
    return result.rows.at(0) || null;
  }

  /**
   * Retrieves a user by email.
   * @param email Email of the user.
   * @returns User object if found, otherwise null.
   */
  async getUserByEmail(email: string) {
    const result = await this.db.query<User>(
      `SELECT * FROM users WHERE email = $1;`,
      [
        email,
      ],
    );

    return result.rows.at(0) || null;
  }

  async getUserWithPasswordByEmail(email: string) {
    const result = await this.db.query(
      `SELECT u.user_id, u.username, u.email, u.is_verified, u.created_at, u.role, pa.password 
       FROM users u
       JOIN password_accounts pa ON u.user_id = pa.user_id
       WHERE u.email = $1;`,
      [email]
    );
  
    return result.rows[0] || null;
  }

  /**
   * Creates a new user.
   * @param data Object containing user data (username, email, hashedPassword).
   * @returns Object containing the ID of the newly created user.
   */
  async createUser(data: {
    username: string;
    email: string;

  }) {
    const { username, email } = data;
    const result = await this.db.query(
      `INSERT INTO users (username, email)
			VALUES ($1, $2)
			RETURNING user_id`,
      [username, email ],
    );
    return result.rows[0] as { user_id: string };
  }

  async createPasswordAccount(data: {
    userId: string;
    hashedPassword: string;
  }) {
    const { userId, hashedPassword,  } = data;
    const result = await this.db.query(
      `INSERT INTO password_accounts (user_id, password)
			VALUES ($1, $2)`,
      [userId, hashedPassword],
    );
    return result.rows[0];
  }

  /**
   * Changes the verification status of a user's email.
   * @param userId ID of the user.
   * @param isVerified New verification status (true/false).
   */
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

   /**
   * Changes the password of a user.
   * @param userId ID of the user.
   * @param newPassword New password.
   */
  async changePassword(
    userId: string,
    newPassword: string,
  ) {
    await this.db.query(`UPDATE password_accounts SET password = $2 WHERE user_id = $1;`, [
      userId,
      newPassword,
    ]);
  }
}
