import { createRouter, createWebHistory } from "vue-router";
import { getMeQueryOptions } from "@/services/user.service";
import { queryClient } from "@/services/queryClient";
import { useAuthStore } from "@/stores/auth.store";
import { pinia } from "@/stores/pinia";

const router = createRouter({
	routes: [
		{
			path: "/",
			component: () => import("../pages/index.vue"),
		},
		{
			path: "/auth/register",
			component: () => import("../pages/auth/register.vue"),
		},
		{
			path: "/auth/login",
			component: () => import("../pages/auth/login.vue"),
		},
		{
			path: "/email-verification",
			component: () => import("../pages/auth/email-verification.vue"),
		},
		{
			path: "/auth/recovery-password",
			component: () => import("../pages/auth/recovery-password.vue"),
		},
		{
			path: "/email-reset-password",
			component: () => import("../pages/auth/reset-password.vue"),
		},
		{
			path: "/user/day-quest",
			component: () => import("../pages/user/dayQuest.vue"),
		},
		{
			path: "/user/day-comment",
			component: () => import("../pages/user/dayComment.vue"),
		},
		{
			path: "/user/day-balance",
			component: () => import("../pages/user/dayBalance.vue"),
		},
		{
			path: "/user/settings",
			component: () => import("../pages/user/settings.vue"),
		},
		{
			path: '/admin',
			children: [
			{ 
				path: 'dashboard',
				name: 'AdminUsersPage', 
				component: () => import("../pages/admin/AdminUsersPageContent.vue") 
				}
			],
			meta: { requiresAdmin: true } // добавляем мета-тег для маршрутов администратора
		  },
		{
			path: "/:pathMatch(.*)*",
			component: () => import("../pages/PageNotFound.vue"),
		},
	],
	history: createWebHistory(),
});

router.beforeEach(async (to) => {
    const { isAuthenticated } = useAuthStore(pinia); 
    if (!isAuthenticated && (to.path === "/auth/login" || to.path === "/auth/register")) {
        return true; 
    }


	if (to.meta.requiresAdmin) {
		try {
			const user = await queryClient.ensureQueryData(getMeQueryOptions);
			
			if (!user.isAdmin) {
				return { path: "/" };
			}
		} catch (error) {
			return { path: "/auth/login" };
		}
	}

    if (to.meta.requiresAuth) {
        try {
            await queryClient.ensureQueryData(getMeQueryOptions);
        } catch (error) {
            return { path: "/auth/login" }; 
        }
    }

    return true;
});

export default router;
