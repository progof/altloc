import { createRouter, createWebHistory } from 'vue-router'
import { getMeQueryOptions } from "@/services/user.service";
import { queryClient } from "@/services/queryClient";
import IndexPage from "@/pages/index.vue"
import RegisterPage from "@/pages/auth/register.vue"
import LoginPage from "@/pages//auth/login.vue"
import EmailVerificationPage from '@/pages/auth/email-verification.vue';
import RecoveryPasswordPage from "@/pages/auth/recovery-password.vue";
import ResetPasswordPage from "@/pages/auth/reset-password.vue";
import DashboardPage from '@/pages/user/dashboard.vue';

const router = createRouter({
  routes: [
    {
      path: '/',
      component: IndexPage
    },
    {
      path: '/auth/register',
      component: RegisterPage
    },
    {
      path: '/auth/login',
      component: LoginPage
    },
    {
      path: "/email-verification",
      component: EmailVerificationPage,
    },
    {
      path: "/auth/recovery-password",
      component: RecoveryPasswordPage,
    },
    {
      path: "/email-reset-password",
      component: ResetPasswordPage,
    },
    {
      path: "/dashboard",
      component: DashboardPage,
    },
  ],
  history: createWebHistory(),
})

router.beforeEach(async (to) => {
  if (to.path === "/auth/login" || to.path === "/auth/register") {
    try {
      await queryClient.ensureQueryData(getMeQueryOptions);
      return { path: "/dashboard" };
    } catch (error) {
      // do nothing
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

export default router
