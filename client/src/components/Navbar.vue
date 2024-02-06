<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { onMounted } from "vue";
import { useLogoutMutation, useLoginMutation } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
// import { pinia } from "../store/pinia";
import MyButton from "./UI/MyButton.vue";

const router = useRouter();
const { mutate: logout } = useLogoutMutation();
const { mutate: login } = useLoginMutation();

const authStore = useAuthStore();
// Проверяем значение статуса аутентификации при загрузке компонента
const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
authStore.isAuthenticated = storedIsAuthenticated === "true";

console.log("default", authStore.isAuthenticated);
</script>

<template>
  <div class="navbar">
    <div @click="$router.push('/')">
      <h1>{Xnote} 📚</h1>
    </div>
    <div v-if="!authStore.isAuthenticated" class="navbar__btns">
      <RouterLink to="/register" class="btn">Register</RouterLink>
      <RouterLink style="margin-left: 20px" to="/login" class="btn"
        >Login</RouterLink
      >
    </div>
    <div v-else class="navbar__btns">
      <RouterLink style="margin-left: 20px" class="btn" to="/dashboard"
        >Home</RouterLink
      >

      <RouterLink style="margin-left: 20px" class="btn" to="/notes/add"
        >Add note</RouterLink
      >
      <RouterLink style="margin-left: 20px" class="btn" to="/notes/feed"
        >Feed</RouterLink
      >

      <RouterLink
        style="margin-left: 20px"
        to="/"
        class="btn"
        @click="
          logout(undefined, {
            onSuccess: () => {
              router.push('/');
            },
          })
        "
        >Logout</RouterLink
      >
    </div>
  </div>
</template>

<style scoped>
.navbar {
  height: 50px;
  background-color: lightgrey;
  box-shadow: 2px 2px 4px gray;
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.navbar__btns {
  margin-left: auto;
}

h1 {
  color: rgb(51, 101, 101);
}

span {
  display: block;
  margin-bottom: 10px;
  color: teal;
}

.btn {
  background-color: teal;
  color: white;
  padding: 10px 10px;
  border: none;
  cursor: pointer;
  margin-top: 1px;
  border-radius: 5px;
}
</style>
