<script setup lang="ts">
import { RouterLink } from "vue-router";

import { useAuthStore } from "@/store/auth.store";
import LogoIcon from "@/assets/logo.svg?component";
// import { pinia } from "../store/pinia";

const authStore = useAuthStore();
const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
authStore.isAuthenticated = storedIsAuthenticated === "true";

console.log("default", authStore.isAuthenticated);
</script>

<template>
  <header v-if="!authStore.isAuthenticated" class="p-2">
    <div class="flex flex-row justify-between">
      <div>
        <a href="/" class="header__logo-link">
          <LogoIcon style="width: 54px; height: 54px" />
        </a>

        <h2 class="header__title-text">AltPlace</h2>
      </div>

      <div class="menu">
        <RouterLink to="/register" class="item">Sign up</RouterLink>
        <RouterLink to="/login" class="item">Login</RouterLink>
      </div>
    </div>
  </header>
  <main>
    <slot />
  </main>
  <footer></footer>
</template>
