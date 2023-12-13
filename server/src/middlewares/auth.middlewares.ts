import type { Request, Response, NextFunction } from "express";
import { config } from "../config";
import { getUserById } from "../user.service";
import { generateAccessToken, getSessionById } from "../auth/auth.service";
import jwt from "jsonwebtoken";

// Function that blocks access to the dashboard for unverified users
export async function blockNotVerifedUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (!req.session.user) {
		return res.status(401).send();
	}
	if (!req.session.user.is_verified) {
		return res.status(401).send({
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
			return res.status(401).send({ errors: [{ message: "Not authorized" }] });
		}

		const payload = jwt.verify(
			req.cookies.access_token,
			config.ACCESS_TOKEN_SECRET
		) as { userId: string };

		const user = await getUserById(payload.userId);
		if (!user) {
			return res.status(401).send({ errors: [{ message: "User not found" }] });
		}

		req.session.user = user;
		return next();
	} catch (error) {
		if (!("refresh_token" in req.cookies) || !req.cookies.refresh_token) {
			return res.status(401).send();
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
				return res.status(401).send();
			}

			req.session.user = user!;
			return next();
		} catch (error) {
			return res
				.status(401)
				.send({ errors: [{ message: (error as Error).message }] });
		}
	}
}
