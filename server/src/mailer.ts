import { config } from "./config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: config.APP_EMAILL_ADDRESS,
		pass: config.APP_EMAILL_PASSWORD,
	},
});

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
		from: config.APP_EMAILL_ADDRESS,
		to: `${email}`,
		subject: "[AltPlace] Account Verification Link",
		text: `Hello, ${username}, 
		  Please verify your email by clicking this link :
		  ${config.CLIENT_URL}/email-verification?user_id=${user_id}&activation_token=${activation_token} `,
	});
};


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
		from: config.APP_EMAILL_ADDRESS,
		to: `${email}`,
		subject: "[AltPlace] Account Reset Password",
		text: `Hello,
			Please сlick on the link to reset your password :
			${config.CLIENT_URL}/email-reset-password?user_id=${user_id}&reset_token=${reset_token} `,
	});
};
