import type { NextFunction, Request, Response } from "express";
import { AdminService } from "@/admin/admin.service.js";
import { db } from "@/db.js";


// Middleware to check if the user is an admin.
export async function checkAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) {
        return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
    }

    const adminService = new AdminService();
    const isAdmin = await adminService.isAdminEmail(db, req.session.user.email);

    if (!isAdmin) {
        return res.status(403).send({ errors: [{ message: "Forbidden" }] });
    }

    next();
}