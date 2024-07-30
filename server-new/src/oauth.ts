import { Google } from "arctic";
import { config } from "./config";

export const google = new Google(
	config.GOOGLE_CLIENT_ID,
	config.GOOGLE_CLIENT_SECRET,
	new URL("/api/auth/google/callback", config.CLIENT_URL).toString(),
);
