import { taskSchema } from "@/dayquest/task.service";
import { z, ZodType } from "zod";

export type User = {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  avatarKey: string | null;
  role: string;
  createdAt: Date;
};


export type DayQuestTask = {
  id: string;
  name: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};


export type DayQuestTaskCategory = {
  taskId: string;
  categoryId: string;
}

export interface DayQuestCategory {
	id: string;
	name: string;
	imageKey: string;
};

const dayQuestCategorySchema = z.object({
	id: z.string(),
	name: z.string(),
	imageKey: z.string(),
}) satisfies ZodType<DayQuestCategory>;


export type Category = (DayQuestCategory) & {
	tasks: Task[];
};

export const categorySchema = z
	.union([dayQuestCategorySchema])
	.and(
		z.object({
			tasks: z.array(taskSchema),
	
		}),
	) satisfies ZodType<Category>;