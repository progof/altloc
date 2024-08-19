import type { NextFunction, Request, Response } from "express";
import { config } from "../config";
import jwt from "jsonwebtoken";
import { authService } from "../main";

/**
 * Middleware function that blocks access to the dashboard for unverified users.
 * @param req Express request object.
 * @param res Express response object.
 * @param next Express next function.
 * @returns Response with status 401 and error message if user is not verified, otherwise continues to the next middleware.
 */
export async function blockNotVerifedUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.session.user) {
    return res.status(401).send();
  }
  if (!req.session.user.is_verified) {
    return res
      .status(401)
      .send({
        errors: [{
          message:
            "Your account is not activated. An activation letter has been sent to your mailbox.",
        }],
      });
  }

  next();
}

/**
 * Middleware function that renews access token with refresh token if access token is expired or not presented in cookies.
 * @param req Express request object.
 * @param res Express response object.
 * @param next Express next function.
 * @returns Response with status 401 and error message if not authorized, otherwise continues to the next middleware.
 */
export async function blockNotAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!("access_token" in req.cookies) && !("refresh_token" in req.cookies)) {
      return res.status(401).send({ errors: [{ message: "Not authorized" }] });
    }

    if (!("access_token" in req.cookies)) {
      throw new Error("Dont have access token");
    }
    const payload = jwt.verify(
      req.cookies.access_token,
      config.ACCESS_TOKEN_SECRET,
    ) as { userId: string, userRole: string };

    const user = await authService.getUserById(payload.userId);
    const role = await authService.getUserRoleById(payload.userId);

    if (!user) {
      return res.status(401).send({ errors: [{ message: "User not found" }] });
    }

    req.session.user = user;
    req.session.role = role;

    return next();
  } catch (error) {
    try {
      const payload = jwt.verify(
        req.cookies.refresh_token,
        config.REFRESH_TOKEN_SECRET,
      ) as { userId: string; userRole: string; sessionId: string };

      const session = await authService.getSessionById(payload.sessionId);
      if (!session) {
        throw new Error("Couldn't find session");
      }
    
      const accessToken = authService.generateAccessToken({
        userId: session.user_id,
        role: session.role
      });
      res.cookie("access_token", accessToken, { httpOnly: true });

      const user = await authService.getUserById(session.user_id);
      if (!user) {
        return res.status(401).send();
      }
      console.log("user", req.session.user);
      req.session.user = user!;
      return next();
    } catch (error) {
      return res
        .status(401)
        .send({ errors: [{ message: (error as Error).message }] });
    }
  }
}

/**
 * Middleware function that blocks access to admin panel.
 * @param req Express request object.
 * @param res Express response object.
 * @param next Express next function.
 * @returns Response with status 401 and error message if user is not an admin, otherwise continues to the next middleware.
 */
export async function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.session.user) {
    return res.status(401).send();
  }
  if (req.session.user.role != 'ADMIN') {
    return res
      .status(401)
      .send({
        errors: [{
          message:
            "Admin access only.",
        }],
      });
  }

  next();
}