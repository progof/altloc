import { z } from "zod";
import bcrypt from "bcrypt";
import { sendPasswordRestToken, sendVerificationEmail } from "../mailer";
import { Request, Response, Router } from "express";
import { AuthService } from "./auth.service";
import {
  blockNotAuthenticated,
  blockNotVerifiedUser,
} from "../middlewares/auth.middlewares";

export class AuthController {
  public readonly router = Router();

  // Constructor initialization of routes
  constructor(private readonly authService: AuthService) {
    this.router.post(
      "/auth/verify-email/:user_id/:activation_token",
      this.handleVerification.bind(this),
    );
    this.router.post(
      "/auth/email-reset-password/:user_id/:reset_token",
      this.handlePasswordReset.bind(this),
    );
    this.router.post(
      "/auth/recovery_password",
      this.handleRecoveryPassword.bind(this),
    );
    this.router.post("/auth/register", this.userRegister.bind(this));
    this.router.post("/auth/login", this.userLogin.bind(this));
    this.router.post(
      "/auth/logout",
      blockNotAuthenticated,
      blockNotVerifiedUser,
      this.userLogout.bind(this),
    );
    this.router.get(
      "/auth/me",
      blockNotAuthenticated,
      blockNotVerifiedUser,
      this.getMe.bind(this),
    );
    this.router.get(
      "/auth/users/:user_id",
      blockNotAuthenticated,
      blockNotVerifiedUser,
      this.getUser.bind(this),
    );
  }

  async userRegister(req: Request, res: Response) {
    const bodySchema = z.object({
      username: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
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
  
      const existingUser = await this.authService.getUserByEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .send({ errors: [{ message: "Email already registered" }] });
      }
  
      const user = await this.authService.createUser({
        email,
        username,
      });
  
      if (!user) {
        return res.status(500).send({
          errors: [{ message: "Failed to create user." }],
        });
      }
  
      await this.authService.createPasswordAccount({
        userId: user.id,
        hashedPassword,
      });
  
      const activation = await this.authService.createOrGetEmailActivation(user.id);
  
      if (!activation) {
        return res.status(500).send({
          errors: [{ message: "Failed to create or retrieve email activation." }],
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
        password: z.string().min(6),
      });

      const body = bodySchema.safeParse(req.body);
      if (!body.success) {
        return res.status(400).send({ errors: body.error.issues });
      }

      const { email, password } = body.data;

      const user = await this.authService.getUserWithPasswordByEmail(email);
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

      const session = await this.authService.createSession(user.id, user.role);

      const accessToken = this.authService.generateAccessToken({
        userId: user.id,
        role: user.role,
      });
      const refreshToken = this.authService.generateRefreshToken({
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

      req.session.user = user;
      return res.status(200).send();
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ errors: [{ message: (error as Error).message }] });
    }
  }

  async userLogout(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send();
    }

    try {
      const userId = req.session.user.id;

      await this.authService.deleteSession(userId);

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
        parsedResult.error.issues,
      );
      return res.status(400).json({ errors: parsedResult.error.issues });
    }

    const { activation_token, user_id } = parsedResult.data;

    try {
      const activation = await this.authService.getUserActivationById(user_id);

      if (!activation || activation.activationToken !== activation_token) {
        return res
          .status(400)
          .send({ errors: [{ message: "Invalid activation token" }] });
      }

      await this.authService.changeEmailVerificationStatus(user_id, true);
      await this.authService.deleteUserActivationToken(user_id);

      return res.status(200).send();
    } catch (error) {
      return res
        .status(400)
        .send({ errors: [{ message: (error as Error).message }] });
    }
  }

  async getMe(req: Request, res: Response) {
    if (!req.session.user) {
      return res.status(401).send({
        errors: [{ message: "Not found session" }],
      });
    }
    const me = await this.authService.getUserById(req.session.user.id);
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
  
      const user = await this.authService.getUserByEmail(email);
      if (!user) {
        return res.status(400).send({
          errors: [{
            message: "No user with this email address is registered.",
          }],
        });
      }
  
      const resetRequest = await this.authService.createOrGetResetPasswordRequest(user.id);
  
      if (!resetRequest) {
        return res.status(500).send({
          errors: [{
            message: "Failed to create or retrieve password reset request.",
          }],
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
      const user = await this.authService.getUserById(params.data.user_id);
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
        parsedResult.error.issues,
      );
      return res.status(400).json({ errors: parsedResult.error.issues });
    }

    const { reset_token, user_id, password } = parsedResult.data;

    try {
      const resetRequest = await this.authService.getResetPasswordRequest(user_id);

      if (!resetRequest || resetRequest.resetToken !== reset_token) {
        return res.status(400).send({
          errors: [{ message: "Invalid reset token or user ID" }],
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await this.authService.changePassword(user_id, hashedPassword);
      await this.authService.deleteUserResetPasswordRequest(user_id);

      return res.status(200).send();
    } catch (error) {
      return res.status(400).send({
        errors: [{ message: (error as Error).message }],
      });
    }
  }
}
