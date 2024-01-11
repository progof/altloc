<script lang="ts">
import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/pages/index.vue";
import RegisterPage from "@/pages/register.vue";
import LoginPage from "@/pages/login.vue";
import DashboardPage from "@/pages/dashboard.vue";
import EmailVerificationPage from "@/pages/email-verification.vue";
import RecoveryPasswordPage from "@/pages/recovery_password.vue";
import ResetPasswordPage from "@/pages/reset_password.vue";
import NoteByIdPage from "@/pages/notes/[id].vue";
import NoteEditor from "@/pages/notes/editor.vue";
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
		{
			path: "/notes/:id",
			component: NoteByIdPage,
		},
		{
			path: "/notes/editor",
			component: NoteEditor,
		},
	],
	history: createWebHistory(),
});

router.beforeEach(async (to) => {
	if (to.path === "/login" || to.path === "/register") {
		try {
			await queryClient.ensureQueryData(getMeQueryOptions);
			return { path: "/dashboard" };
		} catch (error) {
			// do nothing
		}
	}
	if (to.meta.requiresAuth) {
		let me: User;
		try {
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
	font-family: "Arial", sans-serif;
}

.app {
	padding: 20px;
}
</style>
