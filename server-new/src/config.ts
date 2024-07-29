import { z } from "zod";
import { config as loadEnv } from "dotenv";

const envSchema = z.object({
  DB_CONNECTION_URI: z.string().url(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_DATABASE: z.string(),
  SESSION_SECRET: z.string(),
  APP_PORT: z.string(),
  APP_EMAILL_ADDRESS: z.string(),
  APP_EMAILL_PASSWORD: z.string(),
  CLIENT_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
});

export const config = envSchema.parse(loadEnv().parsed);
export type Config = typeof config;
