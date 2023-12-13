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
		subject: "[CyberLive] Account Verification Link",
		text: `Hello, ${username}, 
		  Please verify your email by clicking this link :
		  http://localhost:${config.APP_PORT}/users/verify-email/${user_id}/${activation_token} `,
	});
};
