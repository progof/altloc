<script setup lang="ts">
import { RouterLink } from "vue-router";
// import { useLogoutMutation, useLoginMutation } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import LogoIcon from "@/assets/logo.svg?component";
// import { pinia } from "../store/pinia";

const authStore = useAuthStore();
const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
authStore.isAuthenticated = storedIsAuthenticated === "true";

console.log("default", authStore.isAuthenticated);
</script>

<template>
  <header
    v-if="!authStore.isAuthenticated"
    class="px-14 py-4 sticky top-0 left-0 bg-black"
  >
    <div class="flex flex-row justify-between items-center text-center gap-6">
      <div class="flex flex-row items-center justify-between gap-3">
        <a href="/" class="header__logo-link">
          <LogoIcon style="width: 54px; height: 54px" />
        </a>

        <h2 class="text-2xl text-blue-500 font-bold">AltPlace</h2>
      </div>

      <div class="flex flex-row gap-8">
        <RouterLink
          to="/register"
          class="bg-zinc-900 text-blue-500 font-bold px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white"
          >Sign up</RouterLink
        >
        <RouterLink
          to="/login"
          class="bg-zinc-900 text-blue-500 font-bold px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white"
          >Log in</RouterLink
        >
      </div>
    </div>
  </header>
</template>
