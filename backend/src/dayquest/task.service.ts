import { dayQuestTasksTable } from "@db/schema";
import { z, ZodType } from "zod";
// import {
// 	S3Client,
// } from "@aws-sdk/client-s3";
import { and, eq } from "drizzle-orm";
import { HTTPError, type Database, type Transaction } from "@/utils";

export interface Task {
	id: string;
	categoryId: string;
	name: string;
    isCompleted: boolean;
}

export const taskSchema = z.object({
	id: z.string(),
	categoryId: z.string(),
	name: z.string(),
    isCompleted: z.boolean(),
}) satisfies ZodType<Task>;

export const createTaskBodySchema = z.object({
	categoryId: z.string(),
	name: z.string().min(1).max(256),
	isCompleted: z.boolean().optional().default(false),  
});

export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;


export class TasksService {
	constructor() {}

	async getTaskById(
		db: Database | Transaction,
		options: {
			userId: string;
			taskId: string;
		},
	): Promise<Task> {
		const task = (
			await db
				.select()
				.from(dayQuestTasksTable)
				.where(
					and(
						eq(dayQuestTasksTable.id, options.taskId), 
						eq(dayQuestTasksTable.creatorId, options.userId))
					)
		).at(0);
		if (!task) {
			throw new HTTPError({ message: "Task not found", status: 404 });
		}

		return taskSchema.parse(task);
	}

	async getUserTasksByCategoryId(
		db: Database | Transaction,
		categoryId: string,
	): Promise<Task[]> {
		const tasks = await db
			.select()
			.from(dayQuestTasksTable)
			.where(eq(dayQuestTasksTable.categoryId, categoryId));

		return z.array(taskSchema).parse(tasks);
	}

	async _createTask(
		db: Database | Transaction,
		options: {
			body: CreateTaskBody,
			userId: string;
		},
	): Promise<Task> {
		const { body, userId,  } = options;

		// const createdAt = body.createdAt || new Date().toISOString();
		const task = (
			await db
				.insert(dayQuestTasksTable)
				.values({
					categoryId: body.categoryId,
					creatorId: userId,
					name: body.name,
					// isCompleted: body.isCompleted,
					// createdAt: createdAt,
					// updatedAt: createdAt,
				
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
		},
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
		},
	): Promise<Task> {
		const { taskId, userId } = options;

		const task = (
			await db
				.select()
				.from(dayQuestTasksTable)
				.where(
					and(
						eq(dayQuestTasksTable.id, taskId), 
					eq(dayQuestTasksTable.creatorId, userId)))
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

		await db.update(dayQuestTasksTable).set({
			isCompleted: true,
		}).where(
			and(
				eq(dayQuestTasksTable.id, taskId), 
			eq(dayQuestTasksTable.creatorId, userId))
	
			);
		return taskSchema.parse(task);
	}

	async unCompleteTask(
		db: Database | Transaction,
		options: {
			userId: string;
			taskId: string;
		},
	): Promise<Task> {
		const { taskId, userId } = options;

		const task = (
			await db
				.select()
				.from(dayQuestTasksTable)
				.where(
					and(
						eq(dayQuestTasksTable.id, taskId), 
					eq(dayQuestTasksTable.creatorId, userId)))
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

		await db.update(dayQuestTasksTable).set({
			isCompleted: false,
		}).where(
			and(
				eq(dayQuestTasksTable.id, taskId), 
			eq(dayQuestTasksTable.creatorId, userId))
	
			);
		return taskSchema.parse(task);
	}

	async deleteTask(
		db: Database | Transaction,
		options: {
			userId: string;
			taskId: string;
		},
	): Promise<Task> {
		const { taskId, userId } = options;

		const task = (
			await db
				.select()
				.from(dayQuestTasksTable)
				.where(
					and(
						eq(dayQuestTasksTable.id, taskId), 
					eq(dayQuestTasksTable.creatorId, userId)))
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

		await db.delete(dayQuestTasksTable).where(
			and(
				eq(dayQuestTasksTable.id, taskId), 
			eq(dayQuestTasksTable.creatorId, userId))
	
			);
		return taskSchema.parse(task);
	}
}

