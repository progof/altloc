export interface User {
	id: string;
	username: string;
	email: string;
	emailVerified: boolean;
	avatarKey: string | null;
	role: string;
	score: number;
	createdAt: number;
}

export interface Task {
	id: string;
	categoryId: string;
	name: string;
	isCompleted: boolean;
}

export interface Comment {
	id: string;
	creatorId: string;
	description: string;
	createdAt: number;
}

export interface DayQuestCategory {
	id: string;
	name: string;
}

export interface Category {
	id: string;
	name: string;
	tasks: Task[];
}

export interface DayQuestTask {
	id: string;
	name: string;
	isCompleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface DayQuestTaskCategory {
	taskId: string;
	categoryId: string;
}
