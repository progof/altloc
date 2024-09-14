import { useMutation, queryOptions, useQueryClient } from "@tanstack/vue-query";
import { z } from "zod";
import { FetchError } from "@/utils/fetch";
import { Category } from "@shared/index";

export const updateCategoryBodySchema = z.object({
	name: z.string().min(6).max(32),
});

export type UpdateCategoryBody = z.infer<typeof updateCategoryBodySchema>;

const createCategoryBodySchema = z.object({
	name: z.string().min(6).max(32),
});

export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;

export function useCreateCategoryMutation() {
	return useMutation({
		mutationFn: async (body: CreateCategoryBody) => {
			const res = await fetch("/api/dayquest/category/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			if (!res.ok) {
				throw new FetchError(res);
			}

			return res.json();
		},
	});
}

export const categoriesQuery = queryOptions({
	queryKey: ["api", "dayquest", "categories"],
	queryFn: async ({ signal }) => {
		const res = await fetch("/api/dayquest/categories", { signal });

		if (!res.ok) {
			throw new FetchError(res);
		}

		return res.json() as Promise<Category[]>;
	},
});

export const userCategoryQuery = (categoryId: string) =>
	queryOptions({
		queryKey: ["api", "conferences", "detail", categoryId],
		queryFn: async ({ signal }) => {
			const res = await fetch(`/api/dayquest/category/${categoryId}`, {
				signal,
			});
			if (!res.ok) {
				throw new FetchError(res);
			}

			return res.json() as Promise<Category>;
		},
	});

export function useDeleteCategoryMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (categoryId: string) => {
			console.log("useDeleteCategoryMutation -> categoryId", categoryId);
			const res = await fetch(`/api/dayquest/category/delete/${categoryId}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				throw new FetchError(res);
			}
		},
		onSuccess: (_) => {
			queryClient.invalidateQueries(categoriesQuery);
			// queryClient.removeQueries(categoriesQuery(categoryId));
		},
	});
}

export function useUpdateCategoryMutation() {
	return useMutation({
		mutationFn: async (options: {
			categoryId: string;
			body: UpdateCategoryBody;
		}) => {
			console.log(
				"useUpdateCategoryMutation -> categoryId",
				options.categoryId
			);
			const res = await fetch(
				`/api/dayquest/category/update/${options.categoryId}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(options.body),
				}
			);

			if (!res.ok) {
				throw new FetchError(res);
			}

			return res.json();
		},
	});
}
