import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import { config } from "./config";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { createUser, getUserByEmail, getUserById } from "./user.service";
import {
	createSession,
	deleteSession,
	generateAccessToken,
	generateRefreshToken,
	getSessionById,
} from "./auth.service";
import jwt from "jsonwebtoken";

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

		const user = await getUserById(+payload.userId);
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

			const session = await getSessionById(+payload.sessionId);

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

app.get("/", async (req, res) => {
	res.render("index");
});

app.listen(config.APP_PORT, () => {
	console.log(`Server running on port ${config.APP_PORT}`);
});

app.get("/users/register", (req, res) => {
	res.render("register.ejs");
});

app.get("/users/login", (req, res) => {
	res.render("login.ejs");
});

app.get("/users/dashboard", blockNotAuthenticated, async (req, res) => {
	res.render("dashboard", { user: req.session.user?.username });
});

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

		await createUser({ email, hashedPassword, username });

		res.redirect("/users/login");
	} catch (error) {
		console.error(error);
	}
});

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
