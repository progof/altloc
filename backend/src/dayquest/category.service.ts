import { HTTPError, type Database, type Transaction } from "@/utils.js";
import { z } from "zod";
import { createBaseCategoryObject, getCategoryTasks } from "./shared.js";
import { habitCategoriesTable } from "@db/schema.js";
import { and, eq } from "drizzle-orm";
import { CategoryTask } from "@shared/index.js";

export const createCategoryBodySchema = z.object({
  name: z.string().min(6).max(32),
});

export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;

export const updateCategoryBodySchema = z.object({
  name: z.string().min(6).max(32),
});

export type UpdateCategoryBody = z.infer<typeof updateCategoryBodySchema>;

export class CategoriesService {
  constructor() {}

  async _createCategory(
    tx: Database | Transaction,
    options: {
      creatorId: string;
      body: CreateCategoryBody;
    }
  ): Promise<CreateCategoryBody> {
    const { body, creatorId } = options;

    const category = (
      await tx
        .insert(habitCategoriesTable)
        .values({
          name: body.name,
          creatorId,
        })
        .returning()
    ).at(0);
    if (!category) {
      throw new Error("Failed to create category");
    }

    return {
      ...createBaseCategoryObject({
        category: category,
      }),
    } satisfies CreateCategoryBody;
  }

  async createCategory(
    db: Database | Transaction,
    options: {
      creatorId: string;
      body: CreateCategoryBody;
    }
  ): Promise<CreateCategoryBody> {
    const { body, creatorId } = options;

    return db.transaction(async (tx: any) => {
      const category = await this._createCategory(tx, { creatorId, body });

      return category;
    });
  }

  async getCategory(
    db: Database | Transaction,
    options: {
      categoryId: string;
      creatorId: string;
    }
  ): Promise<CategoryTask> {
    const { categoryId, creatorId } = options;

    return db.transaction(async (tx: any) => {
      const result = await tx
        .select()
        .from(habitCategoriesTable)
        .where(
          and(
            eq(habitCategoriesTable.id, categoryId),
            eq(habitCategoriesTable.creatorId, creatorId)
          )
        );

      const category = result[0];

      if (!category) {
        throw new HTTPError({ status: 404, message: "Category not found" });
      }

      const [tasksByCategoryId] = await Promise.all([
        getCategoryTasks(tx, [categoryId], categoryId),
      ]);

      return {
        ...createBaseCategoryObject({
          category: category,
        }),
        tasks: tasksByCategoryId[categoryId] || [],
      } satisfies CategoryTask;
    });
  }

  async getUserCategories(
    db: Database | Transaction,
    userId: string
  ): Promise<CategoryTask[]> {
    return db.transaction(async (tx: any) => {
      const result = await tx
        .select()
        .from(habitCategoriesTable)
        .where(eq(habitCategoriesTable.creatorId, userId));

      const categoryIds = result.map((row: any) => row.id);

      if (categoryIds.length === 0) return [];

      const [tasksByCategoryId] = await Promise.all([
        getCategoryTasks(tx, categoryIds, userId),
      ]);

      return result.map((row: any) => {
        return {
          ...createBaseCategoryObject({ category: row }),
          tasks: tasksByCategoryId[row.id] || [],
        } satisfies CategoryTask;
      });
    });
  }

  async updateCategory(
    db: Database | Transaction,
    options: {
      creatorId: string;
      categoryId: string;
      body: UpdateCategoryBody;
    }
  ): Promise<CategoryTask> {
    const { body, creatorId, categoryId } = options;

    return db.transaction(async (tx: any) => {
      const category = await this.getCategory(db, {
        categoryId,
        creatorId,
      });

      await tx
        .update(habitCategoriesTable)
        .set({
          name: body.name,
          creatorId,
        })
        .where(eq(habitCategoriesTable.id, categoryId));

      return {
        ...createBaseCategoryObject({
          category: {
            id: categoryId,
            name: body.name ?? category.name,
            creatorId,
          },
        }),
        tasks: category.tasks,
      } satisfies CategoryTask;
    });
  }

  async deleteCategory(
    db: Database | Transaction,
    options: {
      categoryId: string;
      creatorId: string;
    }
  ): Promise<void> {
    const { categoryId, creatorId } = options;

    await db.transaction(async (tx: any) => {
      await this.getCategory(db, {
        categoryId,
        creatorId,
      });

      await tx
        .delete(habitCategoriesTable)
        .where(
          and(
            eq(habitCategoriesTable.id, categoryId),
            eq(habitCategoriesTable.creatorId, creatorId)
          )
        );
    });
  }
}
