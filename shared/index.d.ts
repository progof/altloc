import { taskSchema } from "@/dayquest/task.service";
import { z, ZodType } from "zod";

export type User = {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  avatarKey: string | null;
  role: string;
  score: number;
  createdAt: Date;
};


export type Task = {
  id: string;
  categoryId: string;
  name: string;
  isCompleted: boolean;
};

export type Comment = {
  id: string;
  creatorId: string;
  description: string;
  createdAt: number;
};


export type DayQuestTaskCategory = {
  taskId: string;
  categoryId: string;
}

export interface DayQuestCategory {
	id: string;
	name: string;
	// imageKey: string;
};

const dayQuestCategorySchema = z.object({
	id: z.string(),
	name: z.string(),
	// imageKey: z.string(),
}) satisfies ZodType<DayQuestCategory>;


export type Category = {
  id: string;
	name: string;
	tasks: Task[];
};

export const categorySchema = z
	.union([dayQuestCategorySchema])
	.and(
		z.object({
			tasks: z.array(taskSchema),
	
		}),
	) satisfies ZodType<Category>;