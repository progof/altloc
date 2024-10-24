import {
	text,
	timestamp,
	uuid,
	boolean,
	pgTable,
	integer,
	uniqueIndex,
	pgEnum
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	username: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull().default(false),
	avatarKey: text("avatar_key"),
	role: text("role").notNull().default("user"),
	score: integer("score").notNull().default(0),
	level: integer("level").notNull().default(1),
	currency: integer("currency").notNull().default(0),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof usersTable.$inferSelect;

export const adminsTable = pgTable("admins", {
	email: text("email").notNull().unique(),
});

export const passwordAccountsTable = pgTable("password_accounts", {
	userId: uuid("user_id").primaryKey(),
	password: text("password").notNull(),
});

export type PasswordAccount = typeof passwordAccountsTable.$inferSelect;

export const userSessionsTable = pgTable("user_sessions", {
	sessionId: uuid("session_id").defaultRandom().primaryKey(),
	userId: uuid("user_id").notNull(),
	userRole: text("user_role").notNull(),
});

export type UserSession = typeof userSessionsTable.$inferSelect;

export const emailActivationsTable = pgTable("email_activations", {
	userId: uuid("user_id").notNull().unique(),
	activationToken: uuid("activation_token").defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const googleAccountsTable = pgTable("google_accounts", {
	userId: uuid("user_id")
		.primaryKey()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	googleId: text("google_id").notNull().unique(),
});

export const resetPasswordRequestsTable = pgTable("reset_password_requests", {
	userId: uuid("user_id").notNull().unique(),
	resetToken: uuid("reset_token").defaultRandom().primaryKey(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const habitCategoriesTable = pgTable("habit_categories", {
	id: uuid("id").primaryKey().defaultRandom(),
	creatorId: uuid("user_id").notNull()
	.references(() => usersTable.id, { onDelete: "cascade" }),
	name: text("name").notNull().unique(),
});

export type HabitCategory = typeof habitCategoriesTable.$inferSelect;


export const taskDifficultyEnum = pgEnum(
	"task_difficulty",
	["EASY", "MEDIUM", "HARD"],
);

export const taskPriorityEnum = pgEnum(
	"task_priority",
	["LOW", "MEDIUM", "HIGH"],
);


export const habitTasksTable = pgTable("habit_tasks", {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id")
        .notNull()
        .references(() => habitCategoriesTable.id, { onDelete: "cascade" }),
    creatorId: uuid("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
	difficulty: taskDifficultyEnum("difficulty").notNull(),
    priority: taskPriorityEnum("priority").notNull(),	
    createdAt: timestamp("created_at", { withTimezone: false })
        .notNull()
        .defaultNow(),
});

export type HabitTask = typeof habitTasksTable.$inferSelect;

export const completedTasksTable = pgTable(
	"completed_tasks",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		taskId: uuid("task_id")
			.notNull()
			.references(() => habitTasksTable.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => usersTable.id, { onDelete: "cascade" }),
		completedAt: timestamp("completed_at", { withTimezone: true })
			.notNull()
			.defaultNow()
	},
	(table) => ({
		uniqueTaskCompletion: uniqueIndex("unique_task_completion").on(
			table.taskId,
			table.userId,
			table.completedAt
		),
	})
);

export type CompletedTask = typeof completedTasksTable.$inferSelect;

// pgEnum for emotional state 

export const emotionalStateEnum = pgEnum(
	"emotional_state",
	["VERY_BAD", "BAD", "NEUTRAL", "GOOD", "VERY_GOOD"],
);


export const dayCommentsTable = pgTable("comments", {
	id: uuid("id").defaultRandom().primaryKey(),
	creatorId: uuid("user_id").notNull(),
	description: text("description").notNull(),
	emotionalState: emotionalStateEnum("emotional_state").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type DayQuestComment = typeof dayCommentsTable.$inferSelect;
