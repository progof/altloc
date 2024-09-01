import {
	dayQuestTasksCategoriesTable,
	dayQuestTasksTable,
    dayQuestCategoriesTable,
} from "@db/schema";
// import { categorySchema, type Category } from "@/server/categories";
import { taskSchema, type Task } from "@/dayquest/task.service";
import type { Transaction } from "@/utils";
import { and, count, eq, inArray } from "drizzle-orm";
import sharp from "sharp";
// import { z, ZodType } from "zod";
// import { dateToUTCTimestamp } from "@/utils";
import { type DayQuestCategory } from "shared";


export function createBaseCategoryObject(options: {
	category: typeof dayQuestCategoriesTable.$inferSelect;
}): DayQuestCategory  {
	const { category } = options;
	return {
		id: category.id,
		name: category.name,
		imageKey: category.imageKey,
	};
}

export const createCategoryImageKey = () =>
	`categories/${crypto.randomUUID()}`;

export const compressCategoryImage = (image: ArrayBuffer | Buffer) => {
	return sharp(image)
		.resize({ width: 1600, height: 900, fit: "cover" })
		.webp({ quality: 90 })
		.toBuffer();
};


export async function getCategoryTasks(
	tx: Transaction,
	categoryIds: string[],
): Promise<Record<string, Task[]>> {
	const tasks = await tx
		.select({
			categoryId: dayQuestTasksCategoriesTable.categoryId,
			taskId: dayQuestTasksCategoriesTable.taskId,
			name: dayQuestTasksTable.name,
		})
		.from(dayQuestTasksCategoriesTable)
		.innerJoin(
			dayQuestTasksTable,
			eq(dayQuestTasksCategoriesTable.taskId, dayQuestTasksTable.id),
		)
		.where(inArray(dayQuestTasksCategoriesTable.categoryId, categoryIds));

	const categoryIdToTasks = Object.fromEntries(
		categoryIds.map((id) => [id, [] as Task[]]),
	);

	for (const task of tasks) {
		categoryIdToTasks[task.categoryId]?.push({
			id: task.taskId,
			name: task.name,
		});
	}

	return categoryIdToTasks;
}

