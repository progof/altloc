import {
	text,
	timestamp,
	uuid,
	boolean,
	pgTable,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	username: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull().default(false),
	avatarKey: text("avatar_key"),
    role: text("role").notNull().default("user"),
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

export const dayQuestCategoriesTable = pgTable("day_quest_categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("user_id").notNull(),
	name: text("name").notNull().unique(),
});

export type DayQuestCategory = typeof dayQuestCategoriesTable.$inferSelect;


export const dayQuestTasksTable = pgTable("day_quest_tasks", {
    id: uuid("id").defaultRandom().primaryKey(),
	categoryId: uuid("category_id").notNull(),
    creatorId: uuid("user_id").notNull(),
    name: text("name").notNull(),
    isCompleted: boolean("is_completed").notNull().default(false),

});

export type DayQuestTask = typeof dayQuestTasksTable.$inferSelect;