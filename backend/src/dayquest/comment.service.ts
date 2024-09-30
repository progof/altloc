import { dayQuestCommentsTable } from "@db/schema.js";
import { z, ZodType } from "zod";
import { and, eq } from "drizzle-orm";
import { HTTPError, type Database, type Transaction, dateToUTCTimestamp } from "@/utils.js";
import { Comment, UserComment } from "@shared/index.js";

export const commentSchema = z.object({
	id: z.string(),
	creatorId: z.string(),
	description: z.string(),
	createdAt: z.date(),
}) satisfies ZodType<Comment>;


export const userCommentSchema = z.object({
	id: z.string(),
	creatorId: z.string(),
	description: z.string(),
	createdAt: z.number(),
}) satisfies ZodType<UserComment>;

export const createCommentBodySchema = z.object({
	description: z.string().min(1).max(256),
});

export type CreateCommentBody = z.infer<typeof createCommentBodySchema>;

export const updateCommentBodySchema = z.object({
	description: z.string().min(1).max(256),
});

export type UpdateCategoryBody = z.infer<typeof updateCommentBodySchema>;

export class CommentsService {
	constructor() {}

	async updateComment(
		db: Database | Transaction,
		options: {
			creatorId: string;
			commentId: string;
			body: UpdateCategoryBody;
		}
	): Promise<Comment> {
		const { body, creatorId, commentId } = options;

		const comment = (
			await db
				.update(dayQuestCommentsTable)
				.set({
					description: body.description,
				})
				.where(
					and(
						eq(dayQuestCommentsTable.id, commentId),
						eq(dayQuestCommentsTable.creatorId, creatorId)
					)
				)
				.returning()
		).at(0);
		if (!comment) {
			throw new HTTPError({ message: "Comment not found", status: 404 });
		}

		return commentSchema.parse(comment);
	}

	async getCommentById(
		db: Database | Transaction,
		options: {
			userId: string;
			commentId: string;
		}
	): Promise<UserComment> {
		const comment = (
			await db
				.select()
				.from(dayQuestCommentsTable)
				.where(
					and(
						eq(dayQuestCommentsTable.id, options.commentId),
						eq(dayQuestCommentsTable.creatorId, options.userId)
					)
				)
		).at(0);
		if (!comment) {
			throw new HTTPError({ message: "Comment not found", status: 404 });
		}

		return userCommentSchema.parse(comment);
	}

	async _createComment(
		db: Database | Transaction,
		options: {
			body: CreateCommentBody;
			userId: string;
		}
	): Promise<Comment> {
		const { body, userId } = options;
		const comment = (
			await db
				.insert(dayQuestCommentsTable)
				.values({
					creatorId: userId,
					description: body.description,
				})
				.returning()
		).at(0);
		if (!comment) {
			throw new Error("Failed to create comment");
		}

		return commentSchema.parse(comment);
	}

	async createComment(
		db: Database | Transaction,
		options: {
			body: CreateCommentBody;
			userId: string;
		}
	): Promise<Comment> {
		const { body, userId } = options;

		return db.transaction(async (tx) => {
			const [comment] = await Promise.all([
				this._createComment(tx, { body, userId }).catch((error) => {
					throw error;
				}),
			]);

			return comment;
		});
	}

	// get all comments for a userId

	async getComments(
		db: Database | Transaction,
		options: {
			userId: string;
		}
	): Promise<UserComment[]> {
		const comments = await db
			.select()
			.from(dayQuestCommentsTable)
			.where(eq(dayQuestCommentsTable.creatorId, options.userId))
			.orderBy(dayQuestCommentsTable.createdAt);

		return comments.map((comment) => userCommentSchema.parse(
			{
				id: comment.id,
				creatorId: comment.creatorId,
				description: comment.description,
				createdAt: dateToUTCTimestamp(comment.createdAt),
			} satisfies UserComment));
	}

	async deleteComment(
		db: Database | Transaction,
		options: {
			creatorId: string;
			commentId: string;
		}
	): Promise<Comment> {
		const { commentId, creatorId } = options;

		const comment = (
			await db
				.select()
				.from(dayQuestCommentsTable)
				.where(
					and(
						eq(dayQuestCommentsTable.id, commentId),
						eq(dayQuestCommentsTable.creatorId, creatorId)
					)
				)
		).at(0);

		if (!comment) {
			throw new HTTPError({ message: "Comment not found", status: 404 });
		}

		if (comment.creatorId !== creatorId) {
			throw new HTTPError({
				message: "You are not allowed to delete this comment",
				status: 403,
			});
		}

		await db
			.delete(dayQuestCommentsTable)
			.where(
				and(
					eq(dayQuestCommentsTable.id, commentId),
					eq(dayQuestCommentsTable.creatorId, creatorId)
				)
			);
		return commentSchema.parse(comment);
	}
}