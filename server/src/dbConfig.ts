import { config } from 'dotenv';
import pg from 'pg';
import { z } from 'zod';

const envSchema = z.object({
  DB_CONNECTION_URI: z.string().url(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_DATABASE: z.string(),
  SESSION_SECRET: z.string(),
  APP_PORT: z.string()
});

const env = envSchema.parse(config().parsed);

const connectionString = `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_DATABASE}?sslmode=disable`;

const pool = new pg.Pool({
  connectionString: connectionString
});

try {
  pool.connect();
  console.log("Successfully connected to the database");
} catch (error) {
  console.error("Failed to connect to the database", error);
}

// Create a new table for storing refresh tokens
// const createRefreshTokensTable = async () => {
//   const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS refresh_tokens (
//       user_id SERIAL PRIMARY KEY,
//       token TEXT
//     );
//   `;

//   try {
//     const result = await pool.query(createTableQuery);
//     console.log("Refresh tokens table created successfully:", result);
//   } catch (error) {
//     console.error("Error creating refresh tokens table:", error);
//   }
// };

// Function to save a new refresh token for a user
const saveRefreshToken = async (userId, refreshToken) => {
  const updateTokenQuery = `
    INSERT INTO refresh_tokens (user_id, token)
    VALUES ($1, $2)
    ON CONFLICT (user_id)
    DO UPDATE SET token = $2;
  `;

  try {
    const result = await pool.query(updateTokenQuery, [userId, refreshToken]);
    console.log("Refresh token saved successfully:", result);
  } catch (error) {
    console.error("Error saving refresh token:", error);
  }
};

// Function to get the refresh token for a user
const getRefreshToken = async (userId) => {
  const selectTokenQuery = `
    SELECT token FROM refresh_tokens WHERE user_id = $1;
  `;

  try {
    const result = await pool.query(selectTokenQuery, [userId]);
    return result.rows[0]?.token || null;
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
};


export { pool, saveRefreshToken, getRefreshToken };
