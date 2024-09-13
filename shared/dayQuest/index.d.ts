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
}

