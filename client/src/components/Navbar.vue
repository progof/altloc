<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
// import { useLogoutMutation, useLoginMutation } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import LogoIcon from "@/assets/logo.svg?component";
// import { pinia } from "../store/pinia";

const router = useRouter();

const authStore = useAuthStore();
const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
authStore.isAuthenticated = storedIsAuthenticated === "true";

console.log("default", authStore.isAuthenticated);
</script>

<template>
  <header v-if="!authStore.isAuthenticated" class="header">
    <a href="/" class="header__logo-link">
      <LogoIcon style="width: 54px; height: 54px" />
    </a>

    <h2 class="header__title-text">AltPlace</h2>

    <div class="menu">
      <RouterLink to="/register" class="item">Sign up</RouterLink>
      <RouterLink to="/login" class="item">Login</RouterLink>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: #0b020e;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1% 0 1% 0;
}

.header__title-text {
  color: rgb(55, 146, 225);
}

.menu {
  display: flex;
  flex-direction: row;
  justify-content: center; /* Добавлено */
}

.item {
  background-color: #181818;
  padding: 10px;
  color: rgb(55, 146, 225);
  border-radius: 10px;
  font-size: 16px;
  text-align: center;
  /* display: flex; */
  align-items: center; /* Добавлено */
  margin-right: 20px;
  text-decoration: none;
  width: 70px;
  height: 20px;
  font-weight: bold;
}

.item:hover {
  background-color: rgb(55, 146, 225);
  color: #12171e;
}
</style>
