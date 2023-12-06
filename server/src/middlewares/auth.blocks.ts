import type { Request, Response, NextFunction } from "express";
import { config } from "../config";
import { getUserById } from "../user.service";
import { generateAccessToken, getSessionById } from "../auth.service";
import jwt from "jsonwebtoken";

// Function that blocks access to the dashboard for unverified users
export async function blockNotVerifedUser(
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
export async function blockNotAuthenticated(
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