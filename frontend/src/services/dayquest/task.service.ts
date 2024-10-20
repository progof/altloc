import { z, ZodType } from "zod";
import { FetchError } from "@/utils/fetch";
import { queryOptions, useQueryClient, useMutation } from "@tanstack/vue-query";
import {
	categoriesQuery,
	userCategoryQuery,
} from "@/services/dayquest/category.service";
import { HabitCategory, User } from "@shared/index";
import { getMeQueryOptions } from "../user.service";

export const TASK_DIFFICULTY = {
	EASY: "EASY",
	MEDIUM: "MEDIUM",
	HARD: "HARD",
} as const;

export const TASK_PRIORITY = {
	LOW: "LOW",
	MEDIUM: "MEDIUM",
	HIGH: "HIGH",
} as const;

export interface Task {
	categoryId: string;
	id: string;
	name: string;
	isCompleted: boolean;
	createdAt: string;
}

export const taskSchema = z.object({
	categoryId: z.string(),
	id: z.string(),
	name: z.string(),
	isCompleted: z.boolean(),
	createdAt: z.string(),
}) satisfies ZodType<Task>;

export const  createTaskBodySchema = z.object({
	name: z.string().min(1).max(32),
	difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;

// const errorSchema = z.object({
// 	errors: z.array(
// 		z.object({
// 			message: z.string(),
// 		})
// 	),
// });

export const tasksQuery = queryOptions({
	queryKey: ["api", "dayquest", "tasks"],
	queryFn: async ({ signal }) => {
		const res = await fetch(`/api/dayquest/tasks/`, { signal });

		if (!res.ok) {
			throw new FetchError(res);
		}

		return res.json() as Promise<Task[]>;
	},
});

export const meTaskQuery = (taskId: string) =>
	queryOptions({
		queryKey: ["api", "tasks", "detail", taskId],
		queryFn: async ({ signal }) => {
			const res = await fetch(`/api/dayquest/task/${taskId}`, { signal });
			if (!res.ok) {
				throw new FetchError(res);
			}

			return res.json() as Promise<Task>;
		},
	});

export function useCreateTaskMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (body: CreateTaskBody) => {
			const res = await fetch("/api/dayquest/task/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			if (!res.ok) {
				throw new FetchError(res);
			}
			// if (!res.ok) {
			// 	const errors = errorSchema.parse(await res.json()).errors;
			// 	throw new Error(errors.at(0)?.message);
			// }

			return res.json() as Promise<Task>;
		},
		onSuccess: (newTask) => {
			const { queryKey } = userCategoryQuery(newTask.categoryId);
			queryClient.setQueryData(queryKey, (category: HabitCategory | undefined) => {
				if (!category) return undefined; // Если категории нет, возвращаем undefined
				return {
					...category,
					tasks: [...(category.tasks || []), newTask], // Возвращаем обновленную категорию с новыми задачами
				} as HabitCategory; // Явно указываем тип возвращаемого значения
			});
			queryClient.invalidateQueries(categoriesQuery);
		},
	});
}


export function useDeleteTaskMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (taskId: string) => {
			const res = await fetch(`/api/dayquest/task/delete/${taskId}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				throw new FetchError(res);
			}
		},
		onSuccess: (_, taskId) => {
			queryClient.invalidateQueries(categoriesQuery);
			queryClient.removeQueries(userCategoryQuery(taskId));
		},
	});
}

export function useCompleteTaskMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (taskId: string) => {
			console.log("useCompleteTaskMutation Sending request to complete task with ID:", taskId);
			const res = await fetch(`/api/dayquest/task/complete/${taskId}`, {
				method: "PATCH",
			});
			console.log("Response status:", res.status); // Вывод статуса ответа

			if (!res.ok) {
				throw new FetchError(res);
			}

			if (res.ok) {
				console.log("Task done!!!");
			}

			

			return res.json() as Promise<Task>;;
		},
		onSuccess: (updatedTask: Task) => {
			console.log("Task done!!!");
			queryClient.setQueryData(
				tasksQuery.queryKey,
				(tasks: Task[] | undefined) => {
					if (!tasks) return [];

					return tasks.map((task) =>
						task.id === updatedTask.id ? { ...task, isCompleted: true } : task
					);
				}
			);

			queryClient.setQueryData(
				meTaskQuery(updatedTask.id).queryKey,
				updatedTask
			);
			queryClient.setQueryData(
				getMeQueryOptions.queryKey,
				(user: User | undefined) => {
					if (!user) return;
					return {
						...user,
						score: user.score + 1,
					};
				}
				
			);
			// queryClient for user upadate level
			queryClient.setQueryData(
				getMeQueryOptions.queryKey,
				(user: User | undefined) => {
					if (!user) return;
					const needSroceForNextLevel = (user.level + 1) * 8;
					if (user.score >= needSroceForNextLevel) {
						return {
							...user,
							level: user.level + 1,
						};
					}
					return user;
				}
			);
			
		},
	});
}


export function useUnCompleteTaskMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (taskId: string) => {
			console.log("useUnCompleteTaskMutation Sending request to complete task with ID:", taskId);
			const res = await fetch(`/api/dayquest/task/uncomplete/${taskId}`, {
				method: "PATCH",
			});
			console.log("Response status: useUnCompleteTaskMutation", res.status); // Вывод статуса ответа

			if (!res.ok) {
				throw new FetchError(res);
			}

			if (res.ok) {
				console.log("Task UnComplete done!!!");
			}

			

			return res.json() as Promise<Task>;;
		},
		onSuccess: (updatedTask: Task) => {
			queryClient.setQueryData(
				tasksQuery.queryKey,
				(tasks: Task[] | undefined) => {
					if (!tasks) return [];

					return tasks.map((task) =>
						task.id === updatedTask.id ? { ...task, isCompleted: true } : task
					);
				}
			);

			queryClient.setQueryData(
				meTaskQuery(updatedTask.id).queryKey,
				updatedTask
			);
			queryClient.setQueryData(
				getMeQueryOptions.queryKey,
				(user: User | undefined) => {
					if (!user) return;
					return {
						...user,
						score: user.score - 1,
					};
				}
				
			);
			
		},
	});
}

// export function useUnCompleteTaskMutation() {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: async (taskId: string) => {
		
// 			const res = await fetch(`/api/dayquest/task/uncomplete/${taskId}`, {
// 				method: "PATCH",
// 			});

// 			if (!res.ok) {
// 				throw new FetchError(res);
// 			}

// 			return res.json();
// 		},
// 		onSuccess: (updatedTask) => {
// 			queryClient.setQueryData(
// 				tasksQuery.queryKey,
// 				(tasks: Task[] | undefined) => {
// 					if (!tasks) return [];

// 					return tasks.map((task) =>
// 						task.id === updatedTask.id ? { ...task, isCompleted: true } : task
// 					);
// 				}
// 			);
// 			queryClient.setQueryData(
// 				meTaskQuery(updatedTask.id).queryKey,
// 				updatedTask
// 			);
// 		},
// 	});
// }


