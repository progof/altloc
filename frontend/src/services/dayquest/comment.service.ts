import { useMutation, queryOptions, useQueryClient } from "@tanstack/vue-query";
import { z } from "zod";
import { FetchError } from "@/utils/fetch";
import { Comment } from "@shared/index";

export const updateCommentBodySchema = z.object({
	description: z.string().min(1).max(256),
});

export type UpdateCommentBody = z.infer<typeof updateCommentBodySchema>;

const createCommentBodySchema = z.object({
	description: z.string().min(1).max(256),
});

export type CreateCommentBody = z.infer<typeof createCommentBodySchema>;

export function useCreateCommentMutation() {
	return useMutation({
		mutationFn: async (body: CreateCommentBody) => {
			const res = await fetch("/api/dayquest/comment/create", {
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

export const commentsQuery = queryOptions({
	queryKey: ["api", "dayquest", "comments"],
	queryFn: async ({ signal }) => {
		const res = await fetch("/api/dayquest/comments", { signal });

		if (!res.ok) {
			throw new FetchError(res);
		}

		return res.json() as Promise<Comment[]>;
	},
});

export const meCommentQuery = (commentId: string) =>
	queryOptions({
		queryKey: ["api", "comments", "detail", commentId],
		queryFn: async ({ signal }) => {
			const res = await fetch(`/api/dayquest/comment/${commentId}`, { signal });
			if (!res.ok) {
				throw new FetchError(res);
			}

			return res.json() as Promise<Comment>;
		},
	});

export function useDeleteCommentMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (commentId: string) => {
			console.log("useDeleteCommentMutation -> commentId", commentId);
			const res = await fetch(`/api/dayquest/comment/delete/${commentId}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				throw new FetchError(res);
			}
		},
		onSuccess: (_) => {
			queryClient.invalidateQueries(commentsQuery);
			// queryClient.removeQueries(categoriesQuery(categoryId));
		},
	});
}

export function useUpdateCommentMutation() {
	return useMutation({
		mutationFn: async (options: {
			commentId: string;
			body: UpdateCommentBody;
		}) => {
			console.log("useUpdateCategoryMutation -> categoryId", options.commentId);
			const res = await fetch(
				`/api/dayquest/comment/update/${options.commentId}`,
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
