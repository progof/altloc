import { dayCommentsTable } from "@db/schema.js";
import { z, ZodType } from "zod";
import { and, eq, desc } from "drizzle-orm";
import {
  HTTPError,
  type Database,
  type Transaction,
  dateToUTCTimestamp,
} from "@/utils.js";
import { Comment, UserComment } from "@shared/index.js";

export const commentSchema = z.object({
  id: z.string(),
  creatorId: z.string(),
  description: z.string(),
  emotionalState: z.enum(["VERY_BAD", "BAD", "NEUTRAL", "GOOD", "VERY_GOOD"]),
  createdAt: z.date(),
}) satisfies ZodType<Comment>;

export const userCommentSchema = z.object({
  id: z.string(),
  creatorId: z.string(),
  description: z.string(),
  emotionalState: z.enum(["VERY_BAD", "BAD", "NEUTRAL", "GOOD", "VERY_GOOD"]),
  createdAt: z.number(),
}) satisfies ZodType<UserComment>;

export const createCommentBodySchema = z.object({
  description: z.string().min(1).max(256),
  emotionalState: z.enum(["VERY_BAD", "BAD", "NEUTRAL", "GOOD", "VERY_GOOD"]),
});

export type CreateCommentBody = z.infer<typeof createCommentBodySchema>;

export const updateCommentBodySchema = z.object({
  description: z.string().min(1).max(256),
  emotionalState: z.enum(["VERY_BAD", "BAD", "NEUTRAL", "GOOD", "VERY_GOOD"]),
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
        .update(dayCommentsTable)
        .set({
          description: body.description,
          emotionalState: body.emotionalState,
        })
        .where(
          and(
            eq(dayCommentsTable.id, commentId),
            eq(dayCommentsTable.creatorId, creatorId)
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
  ): Promise<Comment> {
    const comment = (
      await db
        .select()
        .from(dayCommentsTable)
        .where(
          and(
            eq(dayCommentsTable.id, options.commentId),
            eq(dayCommentsTable.creatorId, options.userId)
          )
        )
    ).at(0);
    if (!comment) {
      throw new HTTPError({ message: "Comment not found", status: 404 });
    }

    return commentSchema.parse(comment);
    // return commentSchema.parse({
    //   id: comment.id,
    //   creatorId: comment.creatorId,
    //   description: comment.description,
    //   createdAt: dateToUTCTimestamp(comment.createdAt),
    // });
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
        .insert(dayCommentsTable)
        .values({
          creatorId: userId,
          description: body.description,
          emotionalState: body.emotionalState,
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
      .from(dayCommentsTable)
      .where(eq(dayCommentsTable.creatorId, options.userId))
      .orderBy(desc(dayCommentsTable.createdAt));

    return comments.map((comment) =>
      userCommentSchema.parse({
        id: comment.id,
        creatorId: comment.creatorId,
        emotionalState: comment.emotionalState,
        description: comment.description,

        createdAt: dateToUTCTimestamp(comment.createdAt),
      } satisfies UserComment)
    );
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
        .from(dayCommentsTable)
        .where(
          and(
            eq(dayCommentsTable.id, commentId),
            eq(dayCommentsTable.creatorId, creatorId)
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
      .delete(dayCommentsTable)
      .where(
        and(
          eq(dayCommentsTable.id, commentId),
          eq(dayCommentsTable.creatorId, creatorId)
        )
      );
    return commentSchema.parse(comment);
  }
}
