import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";
import {
	userLogin,
	userRegister,
	userLogout,
	handleVerification,
	getMe,
	handleRecoveryPassword,
	handlePasswordReset,
} from "./auth/auth.controller";
import { blockNotAuthenticated, blockNotVerifedUser } from "./middlewares/auth.middlewares";
import { createNewNote, getNote, delNote } from "./app/app.contreoller";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(
	session({
		secret: config.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

app.post("/auth/verify-email/:user_id/:activation_token", handleVerification);
app.post("/auth/email-reset-password/:user_id/:reset_token", handlePasswordReset);
app.post("/auth/recovery_password", handleRecoveryPassword);
app.post("/auth/register", userRegister);
app.post("/auth/login", userLogin);
app.post("/auth/logout", userLogout);
app.get("/auth/me", blockNotAuthenticated, blockNotVerifedUser, getMe);

app.post("/app/create-new-note", blockNotAuthenticated, createNewNote);
app.get("/app/get-note", blockNotAuthenticated, getNote)
app.post("/app/delete-note", blockNotAuthenticated, delNote)


app.listen(config.APP_PORT, () => {
	console.log(`Server running on port ${config.APP_PORT}`);
});
