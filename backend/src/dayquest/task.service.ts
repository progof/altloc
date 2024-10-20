import { completedTasksTable, habitTasksTable, usersTable } from "@db/schema.js";
import { z, ZodType } from "zod";
import { and, eq, sql, gte, lt } from "drizzle-orm";
import { HTTPError, type Database, type Transaction } from "@/utils.js";
import { Task } from "@shared/index.js";

export const taskSchema = z.object({
	id: z.string(),
	categoryId: z.string(),
	name: z.string(),
	priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
	difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
}) satisfies ZodType<Task>;

export const createTaskBodySchema = z.object({
	categoryId: z.string(),
	name: z.string().min(1).max(256),
	priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
	difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
});


const getStartOfToday = () => {
	const now = new Date();
	return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() +1, 0, 0, 0, 0));
};

console.log('getStartOfToday:', getStartOfToday().toISOString());

export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;

export class TasksService {
	constructor() {}

	async getTaskById(
		db: Database | Transaction,
		options: {
			userId: string;
			taskId: string;
		}
	): Promise<Task> {
		const task = (
			await db
				.select()
				.from(habitTasksTable)
				.where(
					and(
						eq(habitTasksTable.id, options.taskId),
						eq(habitTasksTable.creatorId, options.userId)
					)
				)
		).at(0);
		if (!task) {
			throw new HTTPError({ message: "Task not found", status: 404 });
		}

		return taskSchema.parse(task);
	}

	async getUserTasksByCategoryId(
		db: Database | Transaction,
		categoryId: string
	): Promise<Task[]> {
		const tasks = await db
			.select()
			.from(habitTasksTable)
			.where(eq(habitTasksTable.categoryId, categoryId));

		return z.array(taskSchema).parse(tasks);
	}

	async getUserTasksByUserId(
		db: Database | Transaction,
		userId: string
	): Promise<Task[]> {
		const tasks = await db
			.select()
			.from(habitTasksTable)
			.where(eq(habitTasksTable.creatorId, userId));

		return z.array(taskSchema).parse(tasks);
	}

	async _createTask(
		db: Database | Transaction,
		options: {
			body: CreateTaskBody;
			userId: string;
		}
	): Promise<Task> {
		const { body, userId } = options;
		const task = (
			await db
				.insert(habitTasksTable)
				.values({
					categoryId: body.categoryId,
					creatorId: userId,
					name: body.name,
					priority: body.priority,
					difficulty: body.difficulty,
				})
				.returning()
		).at(0);
		if (!task) {
			throw new Error("Failed to create task");
		}

		return taskSchema.parse(task);
	}

	async createTask(
		db: Database | Transaction,
		options: {
			body: CreateTaskBody;
			userId: string;
		}
	): Promise<Task> {
		const { body, userId } = options;

		return db.transaction(async (tx) => {
			const [task] = await Promise.all([
				this._createTask(tx, { body, userId }).catch((error) => {
					throw error;
				}),
			]);

			return task;
		});
	}

	async completeTask(
		db: Database | Transaction,
		options: {
		  userId: string;
		  taskId: string;
		}
	  ) {
		const { taskId, userId } = options;
	  
		const task = (
		  await db
			.select()
			.from(habitTasksTable)
			.where(
			  and(
				eq(habitTasksTable.id, taskId),
				eq(habitTasksTable.creatorId, userId)
			  )
			)
		).at(0);
	  
		if (!task) {
		  throw new HTTPError({ message: "Task not found", status: 404 });
		}
	  
		if (task.creatorId !== userId) {
		  throw new HTTPError({
			message: "You are not allowed to complete this task",
			status: 403,
		  });
		}


        // Получаем все выполненные задачи пользователя за сегодня в данной категории
        const completedTasks = (
            await db
                .select()
                .from(completedTasksTable)
                .where(
                    and(
                        eq(completedTasksTable.taskId, taskId),
                        eq(completedTasksTable.userId, userId),
                        gte(completedTasksTable.completedAt, getStartOfToday())
                    )
                )
        ).length > 0;
	  
		if (completedTasks) {
		  throw new HTTPError({
			message: "Task is already completed",
			status: 400,
		  });
		}

		await db
		  .insert(completedTasksTable)
		  .values({
			taskId: taskId,
			userId: userId,
		  })
		  .returning();
	
	  
		const user = (
		  await db.select().from(usersTable).where(eq(usersTable.id, userId))
		).at(0);
	  
		if (!user) {
		  throw new HTTPError({ message: "User not found", status: 404 });
		}
	  
		await db
		  .update(usersTable)
		  .set({
			score: sql`${usersTable.score} + 1`,
		  })
		  .where(eq(usersTable.id, userId));
	  }
	  
	  async unCompleteTask(
		db: Database | Transaction,
		options: {
		  userId: string;
		  taskId: string;
		}
	  ){
		const { taskId, userId } = options;
	  
		const task = (
		  await db
			.select()
			.from(habitTasksTable)
			.where(
			  and(
				eq(habitTasksTable.id, taskId),
				eq(habitTasksTable.creatorId, userId)
			  )
			)
		).at(0);
	  
		if (!task) {
		  throw new HTTPError({ message: "Task not found", status: 404 });
		}
	  
		if (task.creatorId !== userId) {
		  throw new HTTPError({
			message: "You are not allowed to complete this task",
			status: 403,
		  });
		}

        const todayStart = getStartOfToday();

        const completedTasks = (
            await db
                .select()
                .from(completedTasksTable)
                .where(
                    and(
                        eq(completedTasksTable.taskId, taskId),
                        eq(completedTasksTable.userId, userId),
                        gte(completedTasksTable.completedAt, todayStart),
                    )
                )
        ).length > 0;
	  
		if (completedTasks) {
		  throw new HTTPError({
			message: "Task is already UnCompleted",
			status: 400,
		  });
		}
	

		await db
		  .delete(completedTasksTable)
		  .where(
			and(
			  eq(completedTasksTable.taskId, taskId),
			  eq(completedTasksTable.userId, userId)
			)
		  );
	  
	
		const user = (
		  await db.select().from(usersTable).where(eq(usersTable.id, userId))
		).at(0);
	  
		if (!user) {
		  throw new HTTPError({ message: "User not found", status: 404 });

		}
	  
		console.log("unCompleteTask score:",user.score);
		await db
		  .update(usersTable)
		  .set({
			score: user.score - 1,
		  })
		  .where(eq(usersTable.id, userId));
	  }

	async deleteTask(
		db: Database | Transaction,
		options: {
			userId: string;
			taskId: string;
		}
	): Promise<Task> {
		const { taskId, userId } = options;

		const task = (
			await db
				.select()
				.from(habitTasksTable)
				.where(
					and(
						eq(habitTasksTable.id, taskId),
						eq(habitTasksTable.creatorId, userId)
					)
				)
		).at(0);

		if (!task) {
			throw new HTTPError({ message: "Task not found", status: 404 });
		}

		if (task.creatorId !== userId) {
			throw new HTTPError({
				message: "You are not allowed to delete this task",
				status: 403,
			});
		}

		await db
			.delete(habitTasksTable)
			.where(
				and(
					eq(habitTasksTable.id, taskId),
					eq(habitTasksTable.creatorId, userId)
				)
			);
		return taskSchema.parse(task);
	}
}