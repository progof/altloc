import { queryOptions, useMutation } from "@tanstack/vue-query";
import { z } from "zod";

const errorSchema = z.object({
	errors: z.array(
		z.object({
			message: z.string(),
		})
	),
});

export const useRegisterMutation = () =>
	useMutation({
		mutationFn: async (data: {
			username: string;
			email: string;
			password: string;
		}) => {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const errors = errorSchema.parse(await res.json()).errors;
				throw new Error(errors.at(0)?.message);
			}
			return res.json();
		},
	});

export const useLoginMutation = () =>
	useMutation({
		mutationFn: async (data: { email: string; password: string }) => {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!res.ok) {
				const errors = errorSchema.parse(await res.json()).errors;
				throw new Error(errors.at(0)?.message);
			}
			return;
		},
	});

export const useLogoutMutation = () => {
	return useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/auth/logout", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			});
			if (!res.ok) {
				const errors = errorSchema.parse(await res.json()).errors;
				throw new Error(errors.at(0)?.message);
			}
			return;
		},
	});
};

export type User = {
	user_id: string;
	username: string;
	email: string;
	is_verified: boolean;
};

export const getMeQueryOptions = queryOptions({
	queryKey: ["/auth/me"],
	queryFn: async () => {
		const res = await fetch("/api/auth/me");
		if (!res.ok) {
			const errors = errorSchema.parse(await res.json()).errors;
			throw new Error(errors.at(0)?.message);
		}
		return (await (res.json() as Promise<{ data: User }>)).data;
	},
});

export const useVerifyEmailMutation = () => {
	return useMutation({
		mutationFn: async (data: { user_id: string; activation_token: string }) => {
			const res = await fetch(
				`/api/auth/verify-email/${data.user_id}/${data.activation_token}`,
				{
					method: "POST",
					headers: {
						Accept: "application/json",
					},
				}
			);
			if (!res.ok) {
				throw new Error(await res.text());
			}
			return;
		},
	});
};
