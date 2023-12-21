import { z } from "zod";
import bcrypt from "bcrypt";
import {
	changeEmailVerificationStatus,
	changePassword,
	createUser,
	getUserByEmail,
	getUserById,
} from "../user.service";
import {
	createSession,
	deleteSession,
	deleteUserActivationToken,
	deleteUserResetToken,
	generateAccessToken,
	generateRefreshToken,
	getActivationTokenForUser,
	getUserActivationById,
	getResetTokenForUser,
	getUserPasswordResetById,
} from "./auth.service";
import { sendVerificationEmail, sendPasswordRestToken } from "../mailer";
import { Request, Response } from "express";

// User register
export async function userRegister(req: Request, res: Response) {
	console.log("Request Body (userRegister):", req.body); // Debug req.body
	const bodySchema = z.object({
		username: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
	});

	const parseResult = bodySchema.safeParse(req.body);
	if (!parseResult.success) {
		console.error(parseResult.error);
		return res.status(400).send({
			errors: parseResult.error.issues,
		});
	}

	const { email, password, username } = parseResult.data;

	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		const existingUser = await getUserByEmail(email);
		if (existingUser) {
			return res
				.status(400)
				.send({ errors: [{ message: "Email already registered" }] });
		}

		const { user_id } = await createUser({ email, hashedPassword, username });

		const { activation_token } = await getActivationTokenForUser(user_id);

		sendVerificationEmail({
			activation_token,
			email,
			user_id,
			username,
		});
		console.log("Debug email: ",sendVerificationEmail);
		return res.status(201).send({ data: { user_id } });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.send({ errors: [{ message: (error as Error).message }] });
	}
}

// User login
export async function userLogin(req: Request, res: Response) {
	try {
		console.log("Request Body (userLogin):", req.body); // Debug req.body
		const bodySchema = z.object({
			email: z.string().email(),
			password: z.string().min(6),
		});

		const parsedResult = bodySchema.safeParse(req.body);
		if (!parsedResult.success) {
			return res.status(400).send({ errors: parsedResult.error.issues });
		}

		const { email, password } = parsedResult.data;

		const user = await getUserByEmail(email);
		if (!user) {
			return res.status(400).send({
				errors: [{ message: "User with this email does not exist" }],
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res
				.status(400)
				.send({ errors: [{ message: "Invalid password" }] });
		}

		const { session_id } = await createSession(user.user_id);

		const accessToken = generateAccessToken({ userId: user.user_id });
		const refreshToken = generateRefreshToken({
			userId: user.user_id,
			sessionId: session_id,
		});

		res.cookie("access_token", accessToken, {
			httpOnly: true,
		});
		res.cookie("refresh_token", refreshToken, {
			httpOnly: true,
		});

		req.session.user = user;
		return res.status(200).send();
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.send({ errors: [{ message: (error as Error).message }] });
	}
}

// User logout
export async function userLogout(req: Request, res: Response) {
	if (!req.session.user) {
		return res.status(401).send();
	}

	try {
		const userId = req.session.user.user_id;

		await deleteSession(userId);

		res.clearCookie("access_token", { httpOnly: true });
		res.clearCookie("refresh_token", { httpOnly: true });

		await new Promise<void>((res, rej) => {
			req.session.destroy((err) => {
				if (err) {
					rej(err);
				} else {
					res();
				}
			});
		});
	} catch (error) {
		console.error(error);
		return res
			.status(400)
			.send({ errors: [{ message: "Failed to destroy session" }] });
	}

	return res.status(200).send();
}

// Activation of account
export async function handleVerification(req: Request, res: Response) {
	const bodySchema = z.object({
		activation_token: z.string(),
		user_id: z.string(),
	});

	const parsedResult = bodySchema.safeParse(req.params);
	if (!parsedResult.success) {
		console.error(
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

		if (actual_activation_token !== activation_token) {
			return res
				.status(400)
				.send({ errors: [{ message: "Invalid activation token" }] });
		}

		await changeEmailVerificationStatus(user_id, true);
		await deleteUserActivationToken(user_id);

		return res.status(200).send();
	} catch (error) {
		return res
			.status(400)
			.send({ errors: [{ message: (error as Error).message }] });
	}
}

export async function getMe(req: Request, res: Response) {
	if (!req.session.user) {
		return res.status(401).send({ errors: [{ message: "Not found session" }] });
	}
	const me = await getUserById(req.session.user.user_id);
	if (!me) {
		return res.status(401).send({ errors: [{ message: "Not found user" }] });
	}
	return res.status(200).send({
		data: {
			...me,
			password: undefined,
		},
	});
}

// Section for reset password
export async function handleRecoveryPassword(req: Request, res: Response) {
	console.log("Request Body (handleRecoveryPassword):", req.body); // Debug req.body
	const bodySchema = z.object({
		email: z.string().email()
	});

	const parseResult = bodySchema.safeParse(req.body);
	if (!parseResult.success) {
		console.error(parseResult.error);
		return res.status(400).send({
			errors: parseResult.error.issues,
		});
	}

	try {
		const { email } = parseResult.data;

		const user = await getUserByEmail(email);
		console.log("Request Body (handleRecoveryPassword) -> obj User:", user); // Debug req.body
		if (!user) {
			return res.status(400).send({
			errors: [{ message: "No user with this email address is registered." }],
			});
		}

		const { reset_token } = await getResetTokenForUser(user.user_id);
		console.log("Debug handlePasswordForgot UserID ->", user.user_id)
		console.log("Debug handlePasswordForgot ReseToken ->", reset_token)
		sendPasswordRestToken({
			user_id: user.user_id,
			reset_token,
			email,
		});
		console.log("Debug email: ",sendPasswordRestToken);
		return res.status(200).send();
	}catch (error) {
		return res
			.status(400)
			.send({ errors: [{ message: (error as Error).message }] });
	}
}

export async function handlePasswordReset(req: Request, res: Response) {
	console.log("handlePasswordReset() data:", req.body);
	const bodySchema = z.object({
		password: z.string(),
		reset_token: z.string(),
		user_id: z.string(),
	});
	const parsedResult = bodySchema.safeParse(req.body);
	if (!parsedResult.success) {
		console.error(
			"Reset token or user ID is missing:",
			parsedResult.error.issues
		);
		return res.status(400).json({ errors: parsedResult.error.issues });
	}

	const { reset_token, user_id, password } = parsedResult.data;

	console.log("Reset token from URL:", reset_token);
	console.log("User ID from URL:", user_id);

	try {
		const { reset_token: actual_reset_token } = await getUserPasswordResetById(user_id);

		if (actual_reset_token !== reset_token) {
			return res
				.status(400)
				.send({ errors: [{ message: "Invalid reset token" }] });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		await changePassword(user_id, hashedPassword);
		await deleteUserResetToken(user_id);

		return res.status(200).send();
	} catch (error) {
		return res
			.status(400)
			.send({ errors: [{ message: (error as Error).message }] });
	}
}