import { queryOptions } from "@tanstack/vue-query";
import { z } from "zod";

const errorSchema = z.object({
	errors: z.array(
		z.object({
			message: z.string(),
		})
	),
});

// export const usersTable = pgTable("users", {
// 	id: uuid("id").defaultRandom().primaryKey(),
// 	username: text("name").notNull(),
// 	email: text("email").notNull().unique(),
// 	emailVerified: boolean("email_verified").notNull().default(false),
// 	avatarKey: text("avatar_key"),
//     role: text("role").notNull().default("user"),
// 	createdAt: timestamp("created_at").notNull().defaultNow(),
// });



export type User = {
  user_id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  role: string;
  avatarKey: string;
};

const getUser = async (user_id: string) => {
  const res = await fetch(`/api/auth/users/${user_id}/`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const errors = errorSchema.parse(await res.json()).errors;
    throw new Error(errors.at(0)?.message);
  }

  const responseData = await res.json();
  return responseData.data as User;
};

export const getUserQueryOptions = (user_id: string) =>
  queryOptions({
    queryKey: ["/auth/users", user_id],
    queryFn: () => getUser(user_id),
  });




export const getMeQueryOptions = queryOptions({
	queryKey: ["/auth/me"] as const,
	queryFn: async () => {
		const res = await fetch("/api/auth/me");
		if (!res.ok) {
			const errors = errorSchema.parse(await res.json()).errors;
			throw new Error(errors.at(0)?.message);
		}
		return (await (res.json() as Promise<{ data: User }>)).data;
	},
});
