import { habitTasksTable, habitCategoriesTable, completedTasksTable } from "@db/schema.js";
import { type Transaction } from "@/utils.js";
import { UserTask, type HabitCategory } from "@shared/index.js";
import { inArray, eq, sql } from "drizzle-orm";

const getStartOfToday = () => {
	const now = new Date();
	return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), +1, 0, 0, 0));
};


export function createBaseCategoryObject(options: {
	category: typeof habitCategoriesTable.$inferSelect;
}): HabitCategory {
	const { category } = options;
	return {
		id: category.id,
		name: category.name,
	};
}

export async function getCategoryTasks(
	tx: Transaction,
	categoryIds: string[],
	creatorId: string
): Promise<Record<string, UserTask[]>> {
	const startOfToday = getStartOfToday();
	// Проверка наличия категорий
	if (categoryIds.length === 0) return {};

	const tasks = await tx
		.select({
			categoryId: habitTasksTable.categoryId,
			taskId: habitTasksTable.id,
			name: habitTasksTable.name,
			difficulty: habitTasksTable.difficulty,
			priority: habitTasksTable.priority,
			isCompleted: sql<boolean>`EXISTS (
				SELECT 1 FROM ${completedTasksTable}
				WHERE ${completedTasksTable.taskId} = ${habitTasksTable.id}
				AND ${completedTasksTable.userId} = ${creatorId}
				AND ${completedTasksTable.completedAt} >= ${startOfToday.toISOString()}
			)`
		})
		.from(habitTasksTable)
		.innerJoin(
			habitCategoriesTable,
			eq(habitTasksTable.categoryId, habitCategoriesTable.id)
		)
		.where(inArray(habitTasksTable.categoryId, categoryIds));


	const categoryIdToTasks = Object.fromEntries(
		categoryIds.map((id) => [id, [] as UserTask[]])
	);

	console.log('Retrieved tasks:', tasks);

	for (const task of tasks) {
		categoryIdToTasks[task.categoryId]?.push({
			id: task.taskId,
			name: task.name,
			categoryId: task.categoryId,
			difficulty: task.difficulty,
			priority: task.priority,
			isCompleted: task.isCompleted,
		});
	}

	return categoryIdToTasks;
}
