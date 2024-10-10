import type { NextFunction, Request, Response } from "express";
import { CategoriesService } from "@/dayquest/category.service.js";
import { TasksService } from "@/dayquest/task.service.js";
import { db } from "@/db.js";
import { usersTable } from "@db/schema.js";
import { eq } from "drizzle-orm";

// Middleware to check if the user has only 5 categories.
export async function checkCategoriesLimit(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session.user) {
    return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
  }

  const categoriesService = new CategoriesService();
  const categories = await categoriesService.getUserCategories(
    db,
    req.session.user.id
  );

  if (categories.length >= 5) {
    return res
      .status(400)
      .send({ errors: [{ message: "You can't have more than 5 categories" }] });
  }
  next();
}

// Middleware to check if the user has only 5 tasks in a category.
export async function checkTasksLimit(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session.user) {
    return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
  }

  const tasksService = new TasksService();
  const tasks = await tasksService.getUserTasksByCategoryId(
    db,
    req.body.categoryId
  );

  if (tasks.length >= 5) {
    return res
      .status(400)
      .send({ errors: [{ message: "You can't have more than 5 tasks in a category" }] });
  }
  next();
}

// Middleware level system for dayquest app
export async function checkLevel(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session.user) {
    return res.status(401).send({ errors: [{ message: "Unauthorized" }] });
  }

  const currentUserLevel = req.session.user.level;
  const currentUserScore = req.session.user.score;

  const needSroceForNextLevel = (currentUserLevel + 1) * 8;
  console.log("needSroceForNextLevel", needSroceForNextLevel);
  if(currentUserScore >= needSroceForNextLevel) {
    await db
		  .update(usersTable)
		  .set({
        level: currentUserLevel + 1
		  })
		  .where( eq(usersTable.id, req.session.user.id) );

  }

  next();
}