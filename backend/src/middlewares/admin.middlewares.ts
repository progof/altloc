import type { NextFunction, Request, Response } from "express";

// Middleware to check if the user is an admin.
export async function checkAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) {
        return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
    }

    if (req.session.user.isAdmin !== true) {
        return res.status(403).send({ errors: [{ message: "Forbidden" }] });
    }

    next();
}