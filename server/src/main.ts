import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { config } from "./config";
import {
	userLogin,
	userRegister,
	userLogout,
	handleVerification,
} from "./auth/auth.controller";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
	session({
		secret: config.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

app.get("/auth/verify-email/:user_id/:activation_token", handleVerification);
app.post("/auth/register", userRegister);
app.post("/auth/login", userLogin);
app.get("/auth/logout", userLogout);

app.listen(config.APP_PORT, () => {
	console.log(`Server running on port ${config.APP_PORT}`);
});
