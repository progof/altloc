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
  <!-- <div class="navbar">
    <div @click="$router.push('/')">
      <h1>📚 Alteranium</h1>
    </div>
    <div v-if="!authStore.isAuthenticated" class="navbar__btns">
      <RouterLink to="/register" class="btn">Sing Up</RouterLink>
      <RouterLink style="margin-left: 20px" to="/login" class="btn"
        >Log In</RouterLink
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
  </div> -->

  <header v-if="!authStore.isAuthenticated" class="header">
    <div class="wrapper">
      <div class="header__wrapper">
        <div class="header__logo">
          <a href="/" class="header__logo-link">
            <img
              src="../assets/logo.svg"
              alt="The perfect platform for creating a circle of interest"
              class="header__logo-img"
            />
          </a>
        </div>

        <div class="header__title">
          <h2 class="header__title-text">Alteranium</h2>
        </div>

        <nav class="header__nav">
          <ul class="header__list">
            <li class="header__item">
              <div class="wrapper__join">
                <!-- <a href="#" class="header__link">Join now</a> -->
                <RouterLink to="/register" class="header__link"
                  >Sing up</RouterLink
                >
              </div>
            </li>
            <li class="header__item">
              <div class="wrapper__login">
                <!-- <a href="#" class="header__link">Login</a> -->
                <RouterLink to="/login" class="header__link">Login</RouterLink>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
.wrapper {
  max-width: 1060px;
  margin: 0 auto;
}

.header {
  /* background: #0b020e; */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

.header__wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  padding-top: 24px;
}

.header__title {
  display: flex;
  flex-wrap: wrap;
}

.header__title-text {
  color: #fff;
  text-align: right;
  font-size: 40px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.header__list {
  display: flex;
  flex-wrap: wrap;
}

.header__item {
  margin-right: 40px;
}

.header__item:last-child {
  margin-right: 0;
}

.wrapper__join {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  /* width: 90px;
  height: 30px; */
  flex-shrink: 0;
  background-color: #2925e0;
  stroke-width: 1px;
  stroke: #000;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  padding: 10px;
  color: #000;
  border-radius: 10px;
}

.wrapper__login {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  background-color: #181818;
  padding: 5px;
  color: #fffefe;
  border-radius: 10px;
  padding: 10px;
}

.header__link {
  color: #fffefe;
  text-align: center;
  font-size: 24x;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-decoration: none;
}
</style>
