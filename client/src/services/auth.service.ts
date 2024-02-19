import { queryOptions, useMutation } from "@tanstack/vue-query";
import { z } from "zod";
import { useAuthStore } from "../store/auth.store";
import { pinia } from "../store/pinia";

const authStore = useAuthStore(pinia);	
export const isAuthenticated = authStore.isAuthenticated;	

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
			return;
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
			// Обновляем статус аутентификации через Pinia
			authStore.isAuthenticated = true;
			localStorage.setItem("isAuthenticated", "true");
			console.log("login pinia", authStore.isAuthenticated);
			// console.log(await res.json());
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
			// Обновляем статус аутентификации через Pinia
			authStore.isAuthenticated = false;
			localStorage.setItem("isAuthenticated", "false");
			console.log("logout pinia", authStore.isAuthenticated);
			return;
		},
	});
};

export type User = {
	user_id: string;
	username: string;
	email: string;
	is_verified: boolean;
	role: string;
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

export const useRecoveryPasswordMutation = () =>
	useMutation({
		mutationFn: async (data: { email: string}) => {
			const res = await fetch("/api/auth/recovery_password", {
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

	export const useResetPasswordEmailMutation = () => {
		return useMutation({
			mutationFn: async (data: { user_id: string; reset_token: string; password: string }) => {
				const res = await fetch(
					`/api/auth/email-reset-password/${data.user_id}/${data.reset_token}`,
					{
						method: "POST",
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data),
					}
				);
				if (!res.ok) {
					throw new Error(await res.text());
				}
				return;
			},
		});
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