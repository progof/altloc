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
    class="pointer-events-auto sticky top-0 z-20 bg-[#222629] bg-opacity-90 backdrop-blur-[20px] backdrop-saturate-150 px-6 py-3 md:px-14"
  >
    <div class="container flex items-center justify-between gap-6 w-full">
      <div class="flex items-center justify-between gap-3">
        <a href="/">
          <LogoIcon class="md:w-10 md:h-10 w-8 h-8" />
        </a>

        <h2 class="text-lg md:text-lg text-blue-800 font-bold">AltPlace</h2>
      </div>

      <div class="flex gap-6">
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
  <main class="relative flex flex-1 flex-col bg-[#222629]">
    <slot />
  </main>

  <footer
    v-if="!authStore.isAuthenticated"
    class="bg-[#222629] flex-shrink items-center flex justify-center p-4 h-auto w-full"
  >
    <div class="text-white text-lg flex">
      <span class="pr-2 text-base text-zinc-200"
        >Copyright &copy; {{ new Date().getFullYear() }}</span
      >
      <span class="text-base text-zinc-200">&bull;</span>
      <span class="pl-2 text-base text-zinc-200">All Rights Reserved</span>
    </div>
  </footer>
</template>

<style>
#app {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
}
</style>
