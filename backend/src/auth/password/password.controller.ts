import { z } from "zod";
import bcrypt from "bcrypt";
import { sendPasswordRestToken, sendVerificationEmail } from "../../mailer.js";
import { Request, Response, Router } from "express";
import { AuthPasswordService } from "./password.service.js";
import { UserService } from "@/user/user.service.js";
import {
  blockNotAuthenticated,
  blockNotVerifiedUser,
} from "../../middlewares/auth.middlewares.js";

export class AuthPasswordController {
  public readonly router = Router();

  // Constructor initialization of routes
  constructor(
    private readonly authPasswordService: AuthPasswordService,
    private readonly userService: UserService
  ) {
    this.router.post(
      "/auth/password/verify-email/:user_id/:activation_token",
      this.handleVerification.bind(this)
    );
    this.router.post(
      "/auth/password/email-reset-password/:user_id/:reset_token",
      this.handlePasswordReset.bind(this)
    );
    this.router.post(
      "/auth/password/recovery_password",
      this.handleRecoveryPassword.bind(this)
    );
    this.router.post("/auth/password/register", this.userRegister.bind(this));
    this.router.post("/auth/password/login", this.userLogin.bind(this));
    this.router.post(
      "/auth/password/logout",
      blockNotAuthenticated,
      blockNotVerifiedUser,
      this.userLogout.bind(this)
    );
    this.router.get(
      "/auth/users/:user_id",
      blockNotAuthenticated,
      blockNotVerifiedUser,
      this.getUser.bind(this)
    );
  }

  async userRegister(req: Request, res: Response) {
    const bodySchema = z.object({
      username: z.string().min(1).max(255),
      email: z.string().email(),
      password: z.string().min(6).max(255),
    });

    const body = bodySchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).send({
        errors: body.error.issues,
      });
    }

    const { email, password, username } = body.data;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await this.authPasswordService.getUserByEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .send({ errors: [{ message: "Email already registered" }] });
      }

      const user = await this.authPasswordService.createUser({
        email,
        username,
      });

      if (!user) {
        return res.status(500).send({
          errors: [{ message: "Failed to create user." }],
        });
      }

      await this.authPasswordService.createPasswordAccount({
        userId: user.id,
        hashedPassword,
      });

      const activation =
        await this.authPasswordService.createOrGetEmailActivation(user.id);

      if (!activation) {
        return res.status(500).send({
          errors: [
            { message: "Failed to create or retrieve email activation." },
          ],
        });
      }

      sendVerificationEmail({
        activation_token: activation.activationToken,
        email,
        user_id: user.id,
        username,
      });

      return res.status(201).send({ data: { user_id: user.id } });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ errors: [{ message: (error as Error).message }] });
    }
  }

  async userLogin(req: Request, res: Response) {
    try {
      const bodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6).max(255),
      });

      const body = bodySchema.safeParse(req.body);
      if (!body.success) {
        return res.status(400).send({ errors: body.error.issues });
      }

      console.log(body.data);

      const { email, password } = body.data;

      const user = await this.authPasswordService.getUserByEmail(email);
      const passwordAPI = await this.authPasswordService.getPasswordByUserId(
        user?.id as string
      );
      console.log(user, passwordAPI);

      if (!user) {
        return res.status(400).send({
          errors: [{ message: "User with this email does not exist" }],
        });
      }

      const isMatch = await bcrypt.compare(
        password,
        passwordAPI?.password as string
      );
      if (!isMatch) {
        return res
          .status(400)
          .send({ errors: [{ message: "Invalid password" }] });
      }

      const session = await this.authPasswordService.createSession(
        user.id,
        user.role
      );

      const accessToken = this.authPasswordService.generateAccessToken({
        userId: user.id,
        role: user.role,
      });

      const refreshToken = this.authPasswordService.generateRefreshToken({
        userId: user.id,
        sessionId: session.sessionId,
        role: user.role,
      });

      res.cookie("access_token", accessToken, {
        httpOnly: true,
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
      });

      // res.cookie("access_token", accessToken, {
      //   httpOnly: true,
      //   secure: false, // Для локальной разработки
      //   sameSite: "none", // Для работы на разных доменах
      // });

      // res.cookie("refresh_token", refreshToken, {
      //   httpOnly: true,
      //   secure: false, // Для локальной разработки
      //   sameSite: "none", // Для работы на разных доменах
      // });

      req.session.user = user;
      return res
        .status(200)
        .send({ access_token: accessToken, refresh_token: refreshToken });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ errors: [{ message: (error as Error).message }] });
    }
  }

  async userLogout(req: Request, res: Response) {
    if (!req.session.user) {
      return res
        .status(401)
        .send({ errors: [{ message: "User is not authenticated" }] });
    }

    try {
      const userId = req.session.user.id;

      await this.authPasswordService.deleteSession(userId);

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

  async handleVerification(req: Request, res: Response) {
    const paramsSchema = z.object({
      activation_token: z.string(),
      user_id: z.string(),
    });

    const parsedResult = paramsSchema.safeParse(req.params);
    if (!parsedResult.success) {
      console.error(
        "Activation token or user ID is missing:",
        parsedResult.error.issues
      );
      return res.status(400).json({ errors: parsedResult.error.issues });
    }

    const { activation_token, user_id } = parsedResult.data;

    try {
      const activation =
        await this.authPasswordService.getUserActivationById(user_id);

      if (!activation || activation.activationToken !== activation_token) {
        return res
          .status(400)
          .send({ errors: [{ message: "Invalid activation token" }] });
      }

      await this.authPasswordService.changeEmailVerificationStatus(
        user_id,
        true
      );
      await this.authPasswordService.deleteUserActivationToken(user_id);

      return res.status(200).send();
    } catch (error) {
      return res
        .status(400)
        .send({ errors: [{ message: (error as Error).message }] });
    }
  }

  async handleRecoveryPassword(req: Request, res: Response) {
    const bodySchema = z.object({
      email: z.string().email(),
    });

    const parseResult = bodySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).send({
        errors: parseResult.error.issues,
      });
    }

    try {
      const { email } = parseResult.data;

      const user = await this.authPasswordService.getUserByEmail(email);
      if (!user) {
        return res.status(400).send({
          errors: [
            {
              message: "No user with this email address is registered.",
            },
          ],
        });
      }

      const resetRequest =
        await this.authPasswordService.createOrGetResetPasswordRequest(user.id);

      if (!resetRequest) {
        return res.status(500).send({
          errors: [
            {
              message: "Failed to create or retrieve password reset request.",
            },
          ],
        });
      }

      sendPasswordRestToken({
        user_id: user.id,
        reset_token: resetRequest.resetToken,
        email,
      });

      return res.status(200).send();
    } catch (error) {
      return res
        .status(500)
        .send({ errors: [{ message: (error as Error).message }] });
    }
  }

  async getUser(req: Request, res: Response) {
    const paramsSchema = z.object({
      user_id: z.string(),
    });

    const params = paramsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).send({
        errors: params.error.issues,
      });
    }

    try {
      const user = await this.userService.getUserById(params.data.user_id);
      return res.status(200).send({
        data: user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        errors: [{ message: "Internal Server Error" }],
      });
    }
  }

  async handlePasswordReset(req: Request, res: Response) {
    const bodySchema = z.object({
      password: z.string(),
      reset_token: z.string(),
      user_id: z.string(),
    });

    const parsedResult = bodySchema.safeParse(req.body);
    if (!parsedResult.success) {
      console.error(
        "Reset token or user ID or new password is missing:",
        parsedResult.error.issues
      );
      return res.status(400).json({ errors: parsedResult.error.issues });
    }

    const { reset_token, user_id, password } = parsedResult.data;

    try {
      const resetRequest =
        await this.authPasswordService.getResetPasswordRequest(user_id);

      if (!resetRequest || resetRequest.resetToken !== reset_token) {
        return res.status(400).send({
          errors: [{ message: "Invalid reset token or user ID" }],
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await this.authPasswordService.changePassword(user_id, hashedPassword);
      await this.authPasswordService.deleteUserResetPasswordRequest(user_id);

      return res.status(200).send();
    } catch (error) {
      return res.status(400).send({
        errors: [{ message: (error as Error).message }],
      });
    }
  }
}
