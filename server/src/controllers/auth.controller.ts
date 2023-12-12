import { z } from "zod";
import bcrypt from "bcrypt";
import {
	createUser,
	getUserByEmail,
} from "../user.service";
import {
	createSession,
    deleteSession,
	generateAccessToken,
	generateRefreshToken,
	getActivationTokenForUser,
} from "../middlewares/auth.service";
import { sendVerificationEmail } from "../utils/mailer";
import { Request, Response } from 'express';


export async function userRegister(
    req: Request,
	res: Response) {
    console.log('Request Body:', req.body); // Debug req.body
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

		res.redirect("/users/login" );
	} catch (error) {
		console.error(error);
	}
}

export async function userLogin(
    req: Request,
	res: Response) {
        console.log('Request Body:', req.body); // Debug req.body
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
}

export async function userLogout(
    req: Request,
	res: Response) {
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
    }