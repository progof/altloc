import { Config } from "../config";
import { db } from "../db";
import { dayQuestCategoriesTable, dayQuestTasksTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export class DayQuestService {
  constructor(private readonly config: Config) {}

  // write your methods create category, create task, get tasks, get categories, get tasks by category, update task, delete task, delete category
  async createCategory(name: string, userId: string) {
    const [category] = await db
      .insert(dayQuestCategoriesTable)
      .values({ name, userId })
      .returning();
    return category;
  }

  async getCategories(userId: string) {
    const categories = await db
      .select()
      .from(dayQuestCategoriesTable)
      .where(eq(dayQuestCategoriesTable.userId, userId));
    return categories;
  }

  async deleteCategory(userId: string, categoryId: string) {
    await db
      .delete(dayQuestCategoriesTable)
      .where(eq(dayQuestCategoriesTable.userId, userId))
      .where(eq(dayQuestCategoriesTable.id, categoryId));
  }

  async createTask(userId: string, title: string, categoryId: string) {
    const [task] = await db
      .insert(dayQuestTasksTable)
      .values({ userId, title })
      .returning();
    return task;
  }

  async getTasks(userId: string) {
    const tasks = await db
      .select()
      .from(dayQuestTasksTable)
      .where(eq(dayQuestTasksTable.userId, userId));
    return tasks;
  }
}
