<script lang="ts">
import { createRouter, createWebHistory } from "vue-router";
import IndexPage from "@/pages/index.vue";
import RegisterPage from "@/pages/auth/register.vue";
import LoginPage from "@/pages/auth/login.vue";
import DashboardPage from "@/pages/dashboard.vue";
import EmailVerificationPage from "@/pages/auth/email-verification.vue";
import RecoveryPasswordPage from "@/pages/auth/recovery_password.vue";
import ResetPasswordPage from "@/pages/auth/reset_password.vue";
import NoteByIdPage from "@/pages/notes/[id].vue";
import NoteAdd from "@/pages/notes/add.vue";
import NoteEditor from "@/pages/notes/editor.vue";
import FeedPage from "@/pages/feed.vue";
import ProfilePage from "@/pages/profile.vue";
import SpacesPage from "@/pages/spaces.vue";
import SpaceAdd from "@/pages/spaces/add.vue";
import SpaceByIdPage from "@/pages/spaces/[id].vue";
import SpaceMembers from "@/pages/spaces/members.vue";
import SpaceEvents from "@/pages/spaces/events.vue";
import SpaceChat from "@/pages/spaces/chat.vue";
import SpaceNotes from "@/pages/spaces/notes.vue";
import PostByIdPage from "@/pages/posts/[id].vue";
import PostAdd from "@/pages/posts/add.vue";
import PostEditor from "@/pages/posts/editor.vue";
// import PostFeedPage from "@/pages/posts/feed.vue";
// import { User, getMeQueryOptions } from "@/services/auth.service";
import { getMeQueryOptions } from "@/services/auth.service";
import { queryClient } from "@/services/queryClient";

export const router = createRouter({
  routes: [
    {
      path: "/",
      component: IndexPage,
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
      path: "/spaces/notes/add/:id",
      component: NoteAdd,
    },
    {
      path: "/feed",
      component: FeedPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/notes/editor/:id",
      component: NoteEditor,
    },
    {
      path: "/users/:id",
      component: ProfilePage,
    },
    {
      path: "/spaces/",
      component: SpacesPage,
    },
    {
      path: "/spaces/add",
      component: SpaceAdd,
    },
    {
      path: "/spaces/members/:id",
      component: SpaceMembers,
    },
    {
      path: "/spaces/events/:id",
      component: SpaceEvents,
    },
    {
      path: "/spaces/chat/:id",
      component: SpaceChat,
    },
    {
      path: "/spaces/notes/:id",
      component: SpaceNotes,
    },
    {
      path: "/spaces/:id",
      component: SpaceByIdPage,
    },
    {
      path: "/posts/:id",
      component: PostByIdPage,
    },
    {
      path: "/posts/add",
      component: PostAdd,
    },
    {
      path: "/posts/editor/:id",
      component: PostEditor,
    },
  ],
  history: createWebHistory(),
});

router.beforeEach(async (to) => {
  if (to.path === "/login" || to.path === "/register") {
    try {
      await queryClient.ensureQueryData(getMeQueryOptions);
      return { path: "/feed" };
    } catch (error) {
      // do nothing
    }
  }
  if (to.meta.requiresAuth) {
    try {
      await queryClient.ensureQueryData(getMeQueryOptions);
    } catch (error) {
      return { path: "/login" };
    }
  }

  return true;
});
</script>

<script setup lang="ts">
import Navbar from "@/components/front/Navbar.vue";
import Footer from "./components/front/Footer.vue";
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
  height: 100vh;
  /* padding: 20px; */
  /* background: url("./assets/bg.jpg"), lightgray 50% / cover no-repeat; */
  background: url("./assets/bg.jpg") center no-repeat;
  background-size: cover;
  max-height: 100vh;
  overflow: scroll;

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
  color: inherit;
  text-decoration: none;
}
</style>
