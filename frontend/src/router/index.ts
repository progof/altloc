import { createRouter, createWebHistory } from 'vue-router'
import { getMeQueryOptions } from "@/services/user.service";
import { queryClient } from "@/services/queryClient";
import IndexPage from "@/pages/index.vue"
import RegisterPage from "@/pages/auth/register.vue"
import LoginPage from "@/pages//auth/login.vue"
import EmailVerificationPage from '@/pages/auth/email-verification.vue';
import RecoveryPasswordPage from "@/pages/auth/recovery-password.vue";
import ResetPasswordPage from "@/pages/auth/reset-password.vue";
import DayQuestPage from '@/pages/user/dayQuest.vue';
import DayCommentPage from '@/pages/user/dayComment.vue';
import DayBalancePage from '@/pages/user/dayBalance.vue';
import SettingsPage from '@/pages/user/settings.vue';

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
      path: "/user/day-quest",
      component: DayQuestPage,
    },
    {
      path: "/user/day-comment",
      component: DayCommentPage,
    },
    {
      path: "/user/day-balance",
      component: DayBalancePage,
    },
    {
      path: "/user/settings",
      component: SettingsPage,
    },
  
  ],
  history: createWebHistory(),
})

router.beforeEach(async (to) => {
  if (to.path === "/auth/login" || to.path === "/auth/register") {
    try {
      await queryClient.ensureQueryData(getMeQueryOptions);
      return { path: "/user/day-quest" };
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
