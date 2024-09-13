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
  createdAt: Date;
};


export type DayQuestTaskCategory = {
  taskId: string;
  categoryId: string;
}

export interface DayQuestCategory {
	id: string;
	name: string;
};


export type Category = {
  id: string;
	name: string;
	tasks: Task[];
};
