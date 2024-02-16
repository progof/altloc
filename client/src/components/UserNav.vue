<script setup lang="ts">
import { useRouter } from "vue-router";
import { useLogoutMutation } from "@/services/auth.service";

import MyButton from "@/components/UI/MyButton.vue";

const router = useRouter();

const { mutate: logout } = useLogoutMutation();
</script>

<template>
  <div class="sidebar">
    <div class="wrapper">
      <div class="sidebar__avatar">
        <img
          src="../assets/default_avatar.png"
          alt="The perfect platform for creating a circle of interest"
          class="avatar-img"
        />
      </div>
      <nav class="sidebar__links">
        <ul class="sidebar__list">
          <li class="sidebar__item">
            <RouterLink to="/dashboard" class="sidebar__link"
              >Dashboard</RouterLink
            >
          </li>
          <li class="sidebar__item">
            <RouterLink to="/notes/add" class="sidebar__link"
              >Add note</RouterLink
            >
          </li>
          <li class="sidebar__item">
            <RouterLink to="/notes/feed" class="sidebar__link">Feed</RouterLink>
          </li>
          <li>
            <div class="sidebar__link logout-button">
              <MyButton
                @click="
                  logout(undefined, {
                    onSuccess: () => {
                      router.push('/');
                    },
                  })
                "
              >
                Logout
              </MyButton>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  /* margin-left: 100px;
  height: 100vh; */
  /* width: 200px; */
  /* position: fixed;
  z-index: 1;
  top: 0;
  left: 0; */
  background-color: #0b020e;
  /* padding: 20px;
  display: flex; */
  /* overflow-x: hidden; */
  /* padding-top: 60px; */
  height: 100vh;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 170px;
  background-color: #0b020e;
  padding: 40px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sidebar a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: #818181;
  display: block;
  transition: 0.3s;
}

.avatar-img {
  border-radius: 15px;
  width: 64px;
  height: 64px;
  margin-left: 35px;
  margin-bottom: 35px;
}

.sidebar__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar__item {
  margin-right: 40px;
}

.sidebar__item:last-child {
  margin-right: 0;
}

.sidebar__link {
  color: #fffefe;
  text-align: center;
  font-size: 24x;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-decoration: none;
}

.sidebar__item a:hover {
  color: mistyrose;
  background-color: #818181;
  padding: 10px;
  border: none;
  /* cursor: pointer; */
  margin-top: 10px;
  border-radius: 5px;
}

.logout-button {
  margin-top: auto;
}
</style>
