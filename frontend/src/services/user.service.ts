import { queryOptions } from "@tanstack/vue-query";
import { z } from "zod";
import type { User } from "@shared/index";
import { FetchError } from "@/utils/fetch";

const errorSchema = z.object({
	errors: z.array(
		z.object({
			message: z.string(),
		})
	),
});

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
			throw new FetchError(res);
		}
		return (await (res.json() as Promise<{ data: User }>)).data;
	},
});


// export const getMeQueryOptions = queryOptions({
// 	queryKey: ["auth", "me"] as const,
// 	queryFn: async () => {
// 		const res = await fetch("/api/auth/me");
// 		if (!res.ok) {
// 			throw new FetchError(res);
// 		}

// 		return res.json() as Promise<User>;
// 	},
// });