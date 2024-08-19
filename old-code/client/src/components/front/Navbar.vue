<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/store/auth.store";
import LogoIcon from "@/assets/logo.svg?component";
import DropdownMenu from "@/components/front/DropdownMenu.vue";

const authStore = useAuthStore();
const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
authStore.isAuthenticated = storedIsAuthenticated === "true";

console.log("default", authStore.isAuthenticated);
</script>

<template>
  <header
    v-if="!authStore.isAuthenticated"
    class="px-14 py-4 top-0 left-0 bg-black"
  >
    <div class="flex flex-row justify-between items-center text-center gap-6">
      <div class="flex flex-row items-center justify-between gap-3">
        <a href="/">
          <LogoIcon class="md:w-16 md:h-16 w-11 h-11" />
        </a>

        <h2 class="text-lg md:text-2xl text-blue-500 font-bold">AltPlace</h2>
      </div>

      <div class="flex flex-row gap-8">
        <RouterLink
          to="/register"
          class="bg-zinc-900 text-blue-500 font-bold px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white text-sm hidden md:block"
          >Sign up</RouterLink
        >
        <RouterLink
          to="/login"
          class="bg-zinc-900 text-blue-500 font-bold px-2 py-1 md:px-4 md:py-2 rounded-xl hover:bg-blue-600 hover:text-white text-sm hidden md:block"
          >Log in</RouterLink
        >
        <DropdownMenu class="text-black" />
      </div>
    </div>
  </header>
</template>
