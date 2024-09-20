import { config } from "./config.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "gmail",
	port: config.APP_EMAIL_PORT,
	auth: {
		user: config.APP_EMAIL_ADDRESS,
		pass: config.APP_EMAIL_PASSWORD,
	},
});

/**
 * Function to send a verification email to the user.
 * @param user_id User ID.
 * @param email User email address.
 * @param username User username.
 * @param activation_token Activation token for email verification.
 * @returns Promise representing the result of sending the email.
 */
export const sendVerificationEmail = async ({
	user_id,
	email,
	username,
	activation_token,
}: {
	user_id: string;
	email: string;
	username: string;
	activation_token: string;
}) => {
	return await transporter.sendMail({
		from: config.APP_EMAIL_ADDRESS,
		to: `${email}`,
		subject: "[AltLoc] Account Verification Link",
		text: `Hello, ${username}, 
		  Please verify your email by clicking this link :
		  ${config.CLIENT_URL}/email-verification?user_id=${user_id}&activation_token=${activation_token} `,
	});
};

/**
 * Function to send a password reset email to the user.
 * @param user_id User ID.
 * @param email User email address.
 * @param reset_token Reset token for password reset.
 * @returns Promise representing the result of sending the email.
 */
export const sendPasswordRestToken = async ({
	user_id,
	email,
	reset_token,
}: {
	user_id: string;
	email: string;
	reset_token: string;
}) => {
	return await transporter.sendMail({
		from: config.APP_EMAIL_ADDRESS,
		to: `${email}`,
		subject: "[AltLoc] Account Reset Password",
		text: `Hello,
			Please сlick on the link to reset your password :
			${config.CLIENT_URL}/email-reset-password?user_id=${user_id}&reset_token=${reset_token} `,
	});
};
