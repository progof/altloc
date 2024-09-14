import { dayQuestTasksTable, dayQuestCategoriesTable } from "@db/schema.js";
import { type Task } from "@/dayquest/task.service.js";
import type { Transaction } from "@/utils.ts";
import { type DayQuestCategory } from "@shared/index.js";
import { inArray, eq } from "drizzle-orm";

export function createBaseCategoryObject(options: {
	category: typeof dayQuestCategoriesTable.$inferSelect;
}): DayQuestCategory {
	const { category } = options;
	return {
		id: category.id,
		name: category.name,
	};
}

export async function getCategoryTasks(
	tx: Transaction,
	categoryIds: string[]
): Promise<Record<string, Task[]>> {
	const tasks = await tx
		.select({
			categoryId: dayQuestTasksTable.categoryId,
			taskId: dayQuestTasksTable.id,
			name: dayQuestTasksTable.name,
			isCompleted: dayQuestTasksTable.isCompleted,
		})
		.from(dayQuestTasksTable)
		.innerJoin(
			dayQuestCategoriesTable,
			eq(dayQuestTasksTable.categoryId, dayQuestCategoriesTable.id)
		)
		.where(inArray(dayQuestTasksTable.categoryId, categoryIds));

	const categoryIdToTasks = Object.fromEntries(
		categoryIds.map((id) => [id, [] as Task[]])
	);

	for (const task of tasks) {
		categoryIdToTasks[task.categoryId]?.push({
			id: task.taskId,
			name: task.name,
			categoryId: task.categoryId,
			isCompleted: task.isCompleted,
		});
	}

	return categoryIdToTasks;
}
