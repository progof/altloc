import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import { config } from "./config";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import {
	createUser,
	getUserByEmail,
	getUserById,
	changeEmailVerificationStatus,
} from "./user.service";
import {
	createSession,
	deleteSession,
	generateAccessToken,
	generateRefreshToken,
	getSessionById,
	getUserActivationById,
	getActivationTokenForUser,
} from "./auth.service";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "./mailer";

// Settings express
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "ejs");

app.use(
	session({
		secret: config.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

// Middleware
async function blockNotVerifedUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (!req.session.user) {
		throw new Error("Failed to get session");
	}
	if (!req.session.user.is_verified) {
		return res.render("login", {
			errors: [
				{
					message:
						"Your account is not activated. An activation letter has been sent to your mailbox.",
				},
			],
		});
	}

	next();
}

// Function that blocks access for users who do not have a token or the user does not exist in the database
async function blockNotAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		if (!("access_token" in req.cookies) || !req.cookies.access_token) {
			throw new Error("Token not found");
		}

		const payload = jwt.verify(
			req.cookies.access_token,
			config.ACCESS_TOKEN_SECRET
		) as { userId: string };

		const user = await getUserById(payload.userId);
		if (!user) {
			throw new Error("User not found");
		}

		req.session.user = user;
		return next();
	} catch (error) {
		if (!("refresh_token" in req.cookies) || !req.cookies.refresh_token) {
			return res.redirect("/users/login");
		}

		try {
			const payload = jwt.verify(
				req.cookies.refresh_token,
				config.REFRESH_TOKEN_SECRET
			) as { userId: string; sessionId: string };

			const session = await getSessionById(payload.sessionId);

			const accessToken = generateAccessToken({ userId: session.user_id });
			res.cookie("access_token", accessToken, { httpOnly: true });

			const user = await getUserById(session.user_id);
			if (!user) {
				return res.redirect("/users/login");
			}

			req.session.user = user!;
			return next();
		} catch (error) {
			return res.redirect("/users/login");
		}
	}
}

// The basis of the routes in the application
app.get("/", async (req, res) => {
	res.render("index");
});

app.get("/users/register", (req, res) => {
	res.render("register.ejs");
});

app.get("/users/login", (req, res) => {
	res.render("login.ejs");
});

app.get("/users/dashboard", blockNotAuthenticated, async (req, res) => {
	res.render("dashboard", { user: req.session.user });
});

app.get("/users/verify-email/:user_id/:activation_token", async (req, res) => {
	const bodySchema = z.object({
		activation_token: z.string(),
		user_id: z.string(),
	});

	const parsedResult = bodySchema.safeParse(req.params);
	if (!parsedResult.success) {
		console.log(
			"Activation token or user ID is missing:",
			parsedResult.error.issues
		);
		return res.status(400).json({ errors: parsedResult.error.issues });
	}

	const { activation_token, user_id } = parsedResult.data;

	console.log("Activation token from URL:", activation_token);
	console.log("User ID from URL:", user_id);

	try {
		const { activation_token: actual_activation_token } =
			await getUserActivationById(user_id);
		if (actual_activation_token === activation_token) {
			await changeEmailVerificationStatus(user_id, true);
		}
		res.redirect("/users/dashboard");
	} catch (error) {
		console.error("verifyEmail: ", error);
	}
});

// The application is listening on the port
app.listen(config.APP_PORT, () => {
	console.log(`Server running on port ${config.APP_PORT}`);
});

// New user registration function, data validated with zod
app.post("/users/register", async (req, res) => {
	const bodySchema = z
		.object({
			username: z.string(),
			email: z.string().email(),
			password: z.string().min(6),
			password2: z.string().min(6),
		})
		.refine((data) => data.password === data.password2);

	const parseResult = bodySchema.safeParse(req.body);
	if (!parseResult.success) {
		console.error(parseResult.error);
		return res.render("register", { errors: parseResult.error.issues });
	}

	const { email, password, username } = parseResult.data;

	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		const existingUser = await getUserByEmail(email);
		if (existingUser) {
			return res.render("register", {
				errors: [{ message: "Email already registered" }],
			});
		}

		const { user_id } = await createUser({ email, hashedPassword, username });

		const { activation_token } = await getActivationTokenForUser(user_id);

		await sendVerificationEmail({
			activation_token,
			email,
			user_id,
			username,
		});

		res.redirect("/users/login");
	} catch (error) {
		console.error(error);
	}
});

// User authorization
app.post("/users/login", async (req, res) => {
	const bodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	});

	const parsedResult = bodySchema.safeParse(req.body);
	if (!parsedResult.success) {
		return res.render("login", { errors: parsedResult.error.issues });
	}

	const { email, password } = parsedResult.data;

	const user = await getUserByEmail(email);
	if (!user) {
		return res.render("login", {
			errors: [{ message: "User with this email does not exist" }],
		});
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		return res.render("login", { errors: [{ message: "Invalid password" }] });
	}

	const { session_id } = await createSession(user.user_id);

	const accessToken = generateAccessToken({ userId: user.user_id });
	const refreshToken = generateRefreshToken({
		userId: user.user_id,
		sessionId: session_id,
	});

	res.cookie("access_token", accessToken, { httpOnly: true });
	res.cookie("refresh_token", refreshToken, { httpOnly: true });

	req.session.user = user;
	res.redirect("/users/dashboard");
});

// Account logout
app.get("/users/logout", async (req, res) => {
	if (!req.session.user) {
		return res.redirect("/users/login");
	}

	const userId = req.session.user.user_id;

	await deleteSession(userId);

	res.clearCookie("access_token", { httpOnly: true });
	res.clearCookie("refresh_token", { httpOnly: true });

	req.session.destroy((err) => {
		if (err) {
			console.error("Error destroying session:", err);
			res.redirect("/users/login");
		} else {
			res.redirect("/users/login");
		}
	});
});
