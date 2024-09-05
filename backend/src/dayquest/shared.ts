import {
	dayQuestTasksTable,
    dayQuestCategoriesTable,
} from "@db/schema";
// import { categorySchema, type Category } from "@/server/categories";
import { taskSchema, type Task } from "@/dayquest/task.service";
import type { Transaction } from "@/utils";

// import { z, ZodType } from "zod";
// import { dateToUTCTimestamp } from "@/utils";
import { type DayQuestCategory } from "shared";
import { inArray, eq } from "drizzle-orm";


export function createBaseCategoryObject(options: {
	category: typeof dayQuestCategoriesTable.$inferSelect;
}): DayQuestCategory  {
	const { category } = options;
	return {
		id: category.id,
		name: category.name,
	};
}

export async function getCategoryTasks(
	tx: Transaction,
	categoryIds: string[],
): Promise<Record<string, Task[]>> {
	const tasks = await tx
		.select({
			categoryId: dayQuestTasksTable.categoryId,
			taskId: dayQuestTasksTable.id,
			name: dayQuestTasksTable.name,
		})
		.from(dayQuestTasksTable)
		.innerJoin(
			dayQuestCategoriesTable,
			eq(dayQuestTasksTable.categoryId, dayQuestCategoriesTable.id),
		)
		.where(inArray(dayQuestTasksTable.categoryId, categoryIds));

	// Initialize a record with category IDs as keys and empty arrays as values
	const categoryIdToTasks = Object.fromEntries(
		categoryIds.map((id) => [id, [] as Task[]]),
	);

	// Populate the record with tasks
	for (const task of tasks) {
		categoryIdToTasks[task.categoryId]?.push({
			id: task.taskId,
			name: task.name,
		});
	}

	return categoryIdToTasks;
}

