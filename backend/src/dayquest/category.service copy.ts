import { HTTPError, type Database, type Transaction } from "@/utils";
import { z } from "zod";
import {
	compressCategoryImage,
	createBaseCategoryObject,
	createCategoryImageKey,
	getCategoryTasks,
} from "./shared";
import {
	dayQuestCategoriesTable,
    dayQuestTasksTable,
    dayQuestTasksCategoriesTable,
} from "@db/schema";
import {
	DeleteObjectCommand,
	PutObjectCommand,
	type S3Client,
} from "@aws-sdk/client-s3";
import { and, eq, inArray } from "drizzle-orm";
import type { Task } from "@/dayquest/task.service";
import {Category} from "shared";



const createCategoryBodySchema = z
	.object({
		name: z.string().min(6).max(256),
		taskIds: z
			.array(z.string().uuid())
			.min(1)
			.or(
				z
					.string()
					.uuid()
					.transform((id) => [id]),
			),
	
	});


export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;

type CreateCategoryBodyWithoutImage = z.infer<
	typeof createCategoryBodySchema
>;

export const updateCategoryBodySchema = z
	.object({
		name: z.string().min(6).max(256),
		image: z
			.instanceof(File)
			.refine((file) => file.size < 5 * 1024 * 1024, {
				message: "The image is too large, max size is 5 MB",
			})
			.refine((file) => file.type.startsWith("image/"), {
				message: "The file must be an image",
			}),
	});

export type UpdateCategoryBody = z.infer<typeof updateCategoryBodySchema>;

export class CategoriesService {
	constructor(
		private s3: S3Client,
		private s3Bucket: string,
	) {}


	async _createCategoryWithImageKey(
		tx: Database | Transaction,
		options: {
			creatorId: string;
			body: CreateCategoryBodyWithoutImage;
			imageKey: string;
		},
	): Promise<Category> {
		const { body, creatorId, imageKey } = options;

		const category = (
			await tx
				.insert(dayQuestCategoriesTable)
				.values({
					name: body.name,
					imageKey: imageKey,
					creatorId,
				})
				.returning()
		).at(0);
		if (!category) {
			throw new Error("Failed to create category");
		}

		const [tasks ] =
			await Promise.all([
				tx
					.select()
					.from(dayQuestTasksTable)
					.where(inArray(dayQuestTasksTable.id, body.taskIds)),
			]);

		return {
			...createBaseCategoryObject({
				category: category,
			}),
			tasks,
		} satisfies Category;
	}

	async _uploadConferenceImage(key: string, file: File) {
		await this.s3.send(
			new PutObjectCommand({
				Bucket: this.s3Bucket,
				Key: key,
				Body: await compressCategoryImage(await file.arrayBuffer()),
				ACL: "public-read",
				ContentType: file.type,
			}),
		);
	}

	async createCategory(
		db: Database | Transaction,
		options: {
			creatorId: string;
			body: CreateCategoryBody;
		},
	): Promise<Category> {
		const { body, creatorId } = options;
		const imageKey = createCategoryImageKey();

		return db.transaction(async (tx: any) => {
			const [_, conference] = await Promise.all([
				this._uploadConferenceImage(imageKey, body.image),
				this._createCategoryWithImageKey(tx, { creatorId, body, imageKey }),
			]);

			return conference;
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
					category: category.categories,
	
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

			const categoryIds = result.map((row: any) => row.categories.id);

			if (categoryIds.length === 0) return [];

			const [
			
				tasksByCategoryId,
				
			] = await Promise.all([
			
				getCategoryTasks(tx, categoryIds),
			]);

			return result.map((row: any) => {
				return {
					...createBaseCategoryObject({ category: row.categories}),
					tasks: tasksByCategoryId[row.categories.id] || [],
				
				} satisfies Category;
			});
		});
	}

	async addTaskToCategory(
		db: Database | Transaction,
		options: {
			creatorId: string;
			categoryId: string;
			taskId: string;
		},
	): Promise<Category> {
		const { creatorId, categoryId, taskId } = options;

		return db.transaction(async (tx: any) => {
			const category = await this.getCategory(db, {
				categoryId,
				creatorId,
			});

			const task = (
				await tx
					.select()
					.from(dayQuestTasksTable)
					.where(eq(dayQuestTasksTable.id, taskId))
			).at(0);
			if (!task) {
				throw new HTTPError({ status: 404, message: "Task not found" });
			}

			await tx
				.insert(dayQuestTasksCategoriesTable)
				.values({ categoryId, taskId })
				.returning();

			return {
				...category,
				tasks: [
					...category.tasks,
					{
						id: task.id,
						name: task.name,
                        isCompleted: task.isCompleted,
                        createdAt: task.createdAt,
                        updatedAt: task.updatedAt,
					} as Task,
				],
			};
		});
	}

	async removeTaskFromCategory(
		db: Database | Transaction,
		options: {
			creatorId: string;
			categoryId: string;
			taskId: string;
		},
	): Promise<Category> {
		const { creatorId, categoryId, taskId } = options;

		return db.transaction(async (tx: any) => {
			const category = await this.getCategory(db, {
				categoryId,
				creatorId,
			});

			if (!category.tasks.find((task) => task.id === taskId)) {
				throw new HTTPError({
					status: 404,
					message: "Task not found in category",
				});
			}

			await tx
				.delete(dayQuestTasksCategoriesTable)
				.where(
					and(
						eq(dayQuestTasksCategoriesTable.categoryId, categoryId),
						eq(dayQuestTasksCategoriesTable.taskId, taskId),
					),
				);

			return {
				...category,
				tasks: category.tasks.filter((s) => s.id !== taskId),
			};
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

			const imageKey = createCategoryImageKey();

			const [_1, _2,] = await Promise.all([
				body.image
					? this._uploadConferenceImage(
							createCategoryImageKey(),
							body.image,
						).then(() => {
							this.s3
								.send(
									new DeleteObjectCommand({
										Bucket: this.s3Bucket,
										Key: category.imageKey,
									}),
								)
								.catch(console.error);
						})
					: null,
				tx
					.update(dayQuestCategoriesTable)
					.set({
						name: body.name,
						imageKey: body.image ? imageKey : undefined,
						creatorId,
			
					})
					.where(eq(dayQuestCategoriesTable.id, categoryId)),
				
				
			]);

			return {
				...createBaseCategoryObject({
					category: {
						id: categoryId,
						name: body.name ?? category.name,
						imageKey: body.image ? imageKey : category.imageKey,
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
			const conference = await this.getCategory(db, {
				categoryId,
				creatorId,
			});

			await Promise.all([
				this.s3
					.send(
						new DeleteObjectCommand({
							Bucket: this.s3Bucket,
							Key: conference.imageKey,
						}),
					)
					.catch(console.error),
				
				tx
					.delete(dayQuestTasksCategoriesTable)
					.where(eq(dayQuestTasksCategoriesTable.categoryId, categoryId)),
			]);

			await tx
				.delete(dayQuestCategoriesTable)
				.where(eq(dayQuestCategoriesTable.id, categoryId));
		});
	}
}
