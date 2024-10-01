import type { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
import jwt from "jsonwebtoken";
import { authPasswordService } from "../main.js";

export async function blockNotVerifiedUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session.user) {
    return res.status(401).send();
  }
  if (!req.session.user.emailVerified) {
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

// Middleware для обновления access token с использованием refresh token, если access token истек или отсутствует в cookies
export async function blockNotAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!("access_token" in req.cookies) && !("refresh_token" in req.cookies)) {
      return res.status(401).send({ errors: [{ message: "Not authorized" }] });
    }

    if (!("access_token" in req.cookies)) {
      throw new Error("Don't have access token");
    }

    const payload = jwt.verify(
      req.cookies.access_token,
      config.ACCESS_TOKEN_SECRET
    ) as { userId: string; userRole: string };

    const user = await authPasswordService.getUserById(payload.userId);
    // const role = await authPasswordService.getUserRoleById(payload.userId);

    if (!user) {
      return res.status(401).send({ errors: [{ message: "User not found" }] });
    }

    req.session.user = user;
    // req.session.user.role = role;

    return next();
  } catch (error) {
    try {
      const payload = jwt.verify(
        req.cookies.refresh_token,
        config.REFRESH_TOKEN_SECRET
      ) as { userId: string; userRole: string; sessionId: string };

      const session = await authPasswordService.getSessionById(
        payload.sessionId
      );
      if (!session) {
        throw new Error("Couldn't find session");
      }

      const accessToken = authPasswordService.generateAccessToken({
        userId: session.userId,
        role: session.userRole,
      });
      res.cookie("access_token", accessToken, { httpOnly: true });

      const user = await authPasswordService.getUserById(session.userId);
      if (!user) {
        return res.status(401).send();
      }
      req.session.user = user;
      return next();
    } catch (error) {
      return res
        .status(401)
        .send({ errors: [{ message: (error as Error).message }] });
    }
  }
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    return res.status(401).send();
  }
  if (req.session.user.role !== "ADMIN") {
    return res.status(401).send({
      errors: [
        {
          message: "Admin access only.",
        },
      ],
    });
  }

  next();
}
