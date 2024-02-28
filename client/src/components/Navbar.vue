<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
// import { useLogoutMutation, useLoginMutation } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import LogoIcon from "@/assets/logo.svg?component";
// import { pinia } from "../store/pinia";

const router = useRouter();
// const { mutate: logout } = useLogoutMutation();
// const { mutate: login } = useLoginMutation();

const authStore = useAuthStore();
const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
authStore.isAuthenticated = storedIsAuthenticated === "true";

console.log("default", authStore.isAuthenticated);
</script>

<template>
  <header v-if="!authStore.isAuthenticated" class="header">
    <a href="/" class="header__logo-link">
      <LogoIcon class="header__logo-img" />
    </a>

    <h2 class="header__title-text">AltPlace</h2>

    <div class="menu">
      <RouterLink to="/register" class="item">Sing up</RouterLink>
      <RouterLink to="/login" class="item">Login</RouterLink>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: #0b020e;
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

h2 {
  color: rgb(55, 146, 225);
}
.menu {
  display: flex;
  justify-content: space-around;
}

.item {
  align-items: center;
  background-color: #181818;
  padding: 5px;
  color: rgb(55, 146, 225);
  border-radius: 10px;
  padding: 10px;
  height: 20px;
  width: 65px;
  font-size: 19px;
  text-align: center;
  margin-right: 20px;
}

.item:hover {
  background-color: rgb(55, 146, 225);
  color: #12171e;
}
</style>
