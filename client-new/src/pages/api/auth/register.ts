import { queryOptions, useMutation } from "@tanstack/vue-query";
import { z } from "zod";
import { useAuthStore } from "@/stores/auth.store";
import { pinia } from "@/stores/pinia";

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