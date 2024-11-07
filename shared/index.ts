// User type
export interface User {
	id: string;
	username: string;
	email: string;
	emailVerified: boolean;
	avatarKey: string | null;
	role: string;
	score: number;
	level: number;
	currency: number;
	createdAt: number;
	isAdmin: boolean;
}

// Task type
export interface Task {
	id: string;
	categoryId: string;
	name: string;
	difficulty: string;
	priority: string;
}

export interface UserTask {
	id: string;
	categoryId: string;
	name: string;
	difficulty: string;
	priority: string;
	isCompleted: boolean;
}

export interface CompletedTask{
	id: string;
	userId: string;
	taskId: string;
	completedAt: number;

}

export interface UserComment {
	id: string;
	creatorId: string;
	description: string;
	emotionalState: string;
	createdAt: number;
}

export interface Comment {
	id: string;
	creatorId: string;
	description: string;
	emotionalState: string;
	createdAt: Date;
}

export interface HabitCategory {
	id: string;
	name: string;
	tasks: UserTask[];
}

export interface CategoryTask {
	id: string;
	name: string;
	tasks: Task[];
}

export interface Category {
	id: string;
	name: string;
}

export const TASK_DIFFICULTY = {
	EASY: "EASY",
	MEDIUM: "MEDIUM",
	HARD: "HARD",
} as const;

export const TASK_PRIORITY = {
	LOW: "LOW",
	MEDIUM: "MEDIUM",
	HIGH: "HIGH",
} as const;

export const EMOTIONAL_STATE = {
	VERY_BAD: "VERY_BAD",
	BAD: "BAD",
	NEUTRAL: "NEUTRAL",
	GOOD: "GOOD",
	VERY_GOOD: "VERY_GOOD",
} as const;