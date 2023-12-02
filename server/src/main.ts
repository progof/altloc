import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import { config } from "./config";
import type { Request, Response, NextFunction } from "express";
import { pool } from "./database";
import { z } from "zod";
import bcrypt from "bcrypt";
import { createUser, getUserByEmail } from "./user.service";
import {
	generateAccessToken,
	generateRefreshToken,
	saveRefreshToken,
} from "./auth.service";

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

function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
	if (req.session && (req.session.user || req.cookies.access_token)) {
		return res.redirect("/users/dashboard");
	}
	next();
}

function checkNotAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (req.session.user || req.cookies.access_token) {
		return next();
	}
	res.redirect("/users/login");
}

app.get("/", async (req, res) => {
	res.render("index");
});

app.listen(config.APP_PORT, () => {
	console.log(`Server running on port ${config.APP_PORT}`);
});

app.get("/users/register", checkAuthenticated, (req, res) => {
	res.render("register.ejs");
});

app.get("/users/login", checkAuthenticated, (req, res) => {
	res.render("login.ejs");
});

// app.get("/users/dashboard", checkNotAuthenticated, async (req, res) => {
// 	const accessToken = req.cookies.access_token;
// 	const refreshToken = req.cookies.refresh_token;

// 	if (accessToken) {
// 		jwt.verify(
// 			accessToken,
// 			env.ACCESS_TOKEN_SECRET,
// 			async (err, decodedToken) => {
// 				if (err) {
// 					console.error(err);
// 					// Try using the refresh token on access token verification failure
// 					if (refreshToken) {
// 						const userId = decodedToken ? decodedToken.userId : null;
// 						const storedRefreshToken = await getRefreshToken(userId);
// 						if (refreshToken === storedRefreshToken) {
// 							// If refresh token matches, create a new access token
// 							const newAccessToken = generateAccessToken({ userId });
// 							res.cookie("access_token", newAccessToken, {
// 								httpOnly: true,
// 								path: "/",
// 							});
// 							// Continue with rendering the dashboard
// 							const user = await getUserById(userId);
// 							res.render("dashboard", { user: user ? user.username : null });
// 						} else {
// 							// If refresh token does not match, redirect the user to the login page
// 							res.redirect("/users/login");
// 						}
// 					} else {
// 						// Handle the case when refreshToken is not defined
// 						res.redirect("/users/login");
// 					}
// 				} else {
// 					// Everything is fine with the access token, continue with rendering the dashboard
// 					const user = await getUserById(decodedToken.userId);
// 					res.render("dashboard", { user: user ? user.username : null });
// 				}
// 			}
// 		);
// 	} else {
// 		res.redirect("/users/login");
// 	}
// });

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

	const accessToken = generateAccessToken({ userId: user.user_id });
	const refreshToken = generateRefreshToken({ userId: user.user_id });

	await saveRefreshToken(user.user_id, refreshToken);

	res.cookie("access_token", accessToken, { httpOnly: true, path: "/" });
	res.cookie("refresh_token", refreshToken, { httpOnly: true, path: "/" });

	req.session.user = user;
	res.redirect("/users/dashboard");
});

app.get("/users/logout", async (req, res) => {
	try {
		if (req.session && req.session.user) {
			const userId = req.session.user.user_id;
			console.log("Debun logout [userId]:", userId);

			// Remove refresh token from the database on logout
			await saveRefreshToken(userId, null);

			res.clearCookie("access_token", { path: "/" });
			res.clearCookie("refresh_token", { path: "/" });

			req.session.destroy((err) => {
				if (err) {
					console.error("Error destroying session:", err);
					res.redirect("/");
				} else {
					res.redirect("/");
				}
			});
		} else {
			res.redirect("/");
		}
	} catch (error) {
		console.error("Error during logout:", error);
		res.redirect("/");
	}
});
