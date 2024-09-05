import { z , ZodType } from "zod";
import { FetchError } from "@/utils/fetch";
import { queryOptions, useQueryClient, useMutation } from "@tanstack/vue-query";

export interface Task {
	id: string;
	name: string;
    // isCompleted: boolean;
    // updatedAt: string;
    // createdAt: string;
}

export const taskSchema = z.object({
	id: z.string(),
	name: z.string(),
    // isCompleted: z.boolean(),
    // updatedAt: z.string(),
    // createdAt: z.string(),
}) satisfies ZodType<Task>;

export const createTaskBodySchema = z.object({
	name: z.string().min(1).max(32),
});

export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;


export const tasksQuery = queryOptions({
	queryKey: ["api", "dayquest", "tasks"],
	queryFn: async ({ signal }) => {
		const res = await fetch("/api/dayquest/tasks", { signal });

		if (!res.ok) {
			throw new FetchError(res);
		}

		return res.json() as Promise<Task[]>;
	},
});

export function useCreateTaskMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (body: CreateTaskBody) => {
			const res = await fetch("/api/dayquest/task/create", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),  
			});

			if (!res.ok) {
				throw new FetchError(res);
			}

			return res.json() as Promise<Task>;
		},
		onSuccess: (createdTask) => {
			queryClient.setQueryData(tasksQuery.queryKey, (tasks) => {
				if (!tasks) return [createdTask];
				return [...tasks, createdTask];
			});
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
			queryClient.setQueryData(tasksQuery.queryKey, (tasks) => {
				if (!tasks) return [];
				return tasks.filter((task) => task.id !== taskId);
			});
		},
	});
}

