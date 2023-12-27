<script lang="ts">
import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/pages/index.vue";
import RegisterPage from "@/pages/register.vue";
import LoginPage from "@/pages/login.vue";
import DashboardPage from "@/pages/dashboard.vue";
import EmailVerificationPage from "@/pages/email-verification.vue";
import RecoveryPasswordPage from "@/pages/recovery_password.vue";
import ResetPasswordPage from "@/pages/reset_password.vue";
import { User, getMeQueryOptions } from "@/services/auth.service";
import { queryClient } from "@/services/queryClient";

export const router = createRouter({
	routes: [
		{
			path: "/",
			component: MainPage,
		},
		{
			path: "/register",
			component: RegisterPage,
		},
		{
			path: "/login",
			component: LoginPage,
		},
		{
			path: "/dashboard",
			component: DashboardPage,
			meta: { requiresAuth: true },
		},
		{
			path: "/email-verification",
			component: EmailVerificationPage,
		},
		{
			path: "/recovery-password",
			component: RecoveryPasswordPage,
		},
		{
			path: "/email-reset-password",
			component: ResetPasswordPage,
		},
	],
	history: createWebHistory(),
});

router.beforeEach(async (to) => {
	if (to.meta.requiresAuth) {
		let me: User;
		try {
			// @ts-expect-error
			me = await queryClient.ensureQueryData(getMeQueryOptions);
		} catch (error) {
			return { path: "/login" };
		}
	}

	return true;
});
</script>

<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import { RouterView } from "vue-router";
</script>

<template>
	<Navbar />
	<div class="app">
		<RouterView />
	</div>
</template>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: 'Arial', sans-serif;
}

.ql-editor {
  font-family: 'Arial', sans-serif; /* Используйте подходящий шрифт */
}

.app {
	padding: 20px;
}
</style>
