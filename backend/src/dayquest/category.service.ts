import { HTTPError, type Database, type Transaction } from "@/utils";
import { z } from "zod";
import {
	createBaseCategoryObject,
	getCategoryTasks,
} from "./shared";
import {
	dayQuestCategoriesTable,
} from "@db/schema";
import { and, eq } from "drizzle-orm";
import { Category } from "shared";

export const createCategoryBodySchema = z
	.object({
		name: z.string().min(6).max(32),
	});

export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;

export const updateCategoryBodySchema = z
	.object({
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
		},
	): Promise<CreateCategoryBody> {
		const { body, creatorId } = options;

		const category = (
			await tx
				.insert(dayQuestCategoriesTable)
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
		},
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
		},
	): Promise<Category> {
		const { categoryId, creatorId } = options;

		return db.transaction(async (tx: any) => {
			const result = await tx
				.select()
				.from(dayQuestCategoriesTable)
				.where(
					and(
						eq(dayQuestCategoriesTable.id, categoryId),
						eq(dayQuestCategoriesTable.creatorId, creatorId),
					),
				);

			const category = result[0];

			if (!category) {
				throw new HTTPError({ status: 404, message: "Category not found" });
			}

			const [
				tasksByCategoryId,
			] = await Promise.all([
				getCategoryTasks(tx, [categoryId]),
			]);

			return {
				...createBaseCategoryObject({
					category: category,
				}),
				tasks: tasksByCategoryId[categoryId] || [],
			} satisfies Category;
		});
	}

	async getUserCategories(
		db: Database | Transaction,
		userId: string,
	): Promise<Category[]> {
		return db.transaction(async (tx: any) => {
			const result = await tx
				.select()
				.from(dayQuestCategoriesTable)
				.where(eq(dayQuestCategoriesTable.creatorId, userId));

			const categoryIds = result.map((row: any) => row.id);

			if (categoryIds.length === 0) return [];

			const [
				tasksByCategoryId,
			] = await Promise.all([
				getCategoryTasks(tx, categoryIds),
			]);

			return result.map((row: any) => {
				return {
					...createBaseCategoryObject({ category: row }),
					tasks: tasksByCategoryId[row.id] || [],
				} satisfies Category;
			});
		});
	}

	async updateCategory(
		db: Database | Transaction,
		options: {
			creatorId: string;
			categoryId: string;
			body: UpdateCategoryBody;
		},
	): Promise<Category> {
		const { body, creatorId, categoryId } = options;

		return db.transaction(async (tx: any) => {
			const category = await this.getCategory(db, {
				categoryId,
				creatorId,
			});

			await tx
				.update(dayQuestCategoriesTable)
				.set({
					name: body.name,
					creatorId,
				})
				.where(eq(dayQuestCategoriesTable.id, categoryId));

			return {
				...createBaseCategoryObject({
					category: {
						id: categoryId,
						name: body.name ?? category.name,
						creatorId,
					}
				}),
				tasks: category.tasks,
			} satisfies Category;
		});
	}

	async deleteCategory(
		db: Database | Transaction,
		options: {
			categoryId: string;
			creatorId: string;
		},
	): Promise<void> {
		const { categoryId, creatorId } = options;

		await db.transaction(async (tx: any) => {
			await this.getCategory(db, {
				categoryId,
				creatorId,
			});

			await tx
				.delete(dayQuestCategoriesTable)
				.where(
					and(
						eq(dayQuestCategoriesTable.id, categoryId),
						eq(dayQuestCategoriesTable.creatorId, creatorId),
					),
				);
		});
	}

}