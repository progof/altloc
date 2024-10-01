import type { NextFunction, Request, Response } from "express";
import { CategoriesService } from "@/dayquest/category.service.js";
import { db } from "@/db.js";

// Middleware to check if the user has only 5 categories.
export async function checkCategoriesLimit(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const categoriesService = new CategoriesService();
  const categories = await categoriesService.getUserCategories(
    db,
    req.session.user.id
  );
  if (categories.length >= 5) {
    return res.status(400).json({
      message: "You can't have more than 5 categories",
    });
  }
  next();
}
