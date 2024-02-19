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
import NoteAdd from "@/pages/notes/add.vue";
import NoteEditor from "@/pages/notes/editor.vue";
import NoteFeedPage from "@/pages/notes/feed.vue";
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
      path: "/notes/add",
      component: NoteAdd,
    },
    {
      path: "/notes/feed",
      component: NoteFeedPage,
    },
    {
      path: "/notes/editor/:id",
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
import Footer from "./components/Footer.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <Navbar />
  <div class="app">
    <RouterView />
  </div>
  <Footer></Footer>
</template>

<style>
.app {
  /* padding: 20px; */
  /* background: url("./assets/bg.jpg"), lightgray 50% / cover no-repeat; */
  background: url("./assets/bg.jpg") no-repeat center;
  background-size: cover;
  max-height: 100vh;
  overflow: hidden;

  /* box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  background-size: auto;
  display: flex; */
  /* width: 1440px;
  height: 1024px; */
  /* flex-direction: column;
  align-items: flex-start;
  gap: 10px; */
  box-sizing: border-box;
}

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  font-family: "Montserrat", sans-serif;
  box-sizing: inherit;
}
</style>
