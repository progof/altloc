<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useLogoutMutation } from "@/services/auth.service";

import MenuIcon from "../assets/icons/MenuIcon.svg?component";
import DashboardIcon from "../assets/icons/DashboardIcon.svg?component";
import SpacesIcon from "../assets/icons/SpacesIcon.svg?component";
import LogOutIcon from "../assets/icons/LogOutIcon.svg?component";
import MessageIcon from "../assets/icons/MessageIcon.svg?component";
import FeedIcon from "../assets/icons/FeedIcon.svg?component";
import SettingsIcon from "../assets/icons/SettingsIcon.svg?component";
import AddNoteIcon from "../assets/icons/AddNoteIcon.svg?component";

const router = useRouter();
const { mutate: logout } = useLogoutMutation();

const logoutUser = () => {
  logout(undefined, {
    onSuccess: () => {
      router.push("/");
    },
  });
};

const isSidebarActive = ref(false);

const toggleSidebar = () => {
  isSidebarActive.value = !isSidebarActive.value;
};
</script>

<template>
  <div class="sidebar">
    <div class="menu" @click="toggleSidebar">
      <MenuIcon class="icons" />
    </div>
    <div class="sidebar__links" :class="{ active: isSidebarActive }">
      <RouterLink to="/dashboard" class="sidebar__item">
        <DashboardIcon class="icons" />
        Dashboard
      </RouterLink>
      <RouterLink to="/spaces" class="sidebar__item">
        <SpacesIcon class="icons" />
        Spaces
      </RouterLink>
      <RouterLink to="/notes/feed" class="sidebar__item">
        <FeedIcon class="icons" />
        Feed
      </RouterLink>
      <RouterLink to="/posts/add" class="sidebar__item">
        <AddNoteIcon class="icons" />
        Add post
      </RouterLink>
      <RouterLink to="#" class="sidebar__item">
        <MessageIcon class="icons" />
        Message
      </RouterLink>
      <RouterLink to="#" class="sidebar__item">
        <SettingsIcon class="icons" />
        Setting
      </RouterLink>
      <button class="sidebar__item" @click="logoutUser">
        <LogOutIcon class="icons" />
        Log out
      </button>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 100vw; /*  100vw */
  display: flex;
  background-color: rgba(15, 14, 14, 0.9);
  justify-content: space-between;
  align-items: center;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
}

.menu {
  display: none;
}

.sidebar__links {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.sidebar__links.active {
  display: flex;
}

.sidebar__item {
  margin: 15px;
  display: flex;
  align-items: center;
  color: aliceblue;
  padding: 15px;
  font-size: 15px;
  text-decoration: none;
  border-radius: 12px;
  transition: background-color 0.3s;
}

.sidebar__item:hover {
  background-color: rgb(55, 146, 225);
  color: #12171e;
}

.icons {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

button {
  background-color: rgba(15, 14, 14, 0.9);
  color: aliceblue;
  border: none;
}

@media only screen and (max-width: 600px) {
  .menu {
    display: flex;
    position: absolute;
    top: 15px;
    right: 15px;
    overflow: hidden;
  }

  .sidebar__links {
    display: none;
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(15, 14, 14, 1);
    z-index: 1;
  }

  .sidebar__links.active {
    display: flex;
  }

  .sidebar__item {
    margin-left: 40px;
    padding: 15px;
    width: 100%;
    align-items: center;
  }
}

@media only screen and (min-width: 1000px) {
  .sidebar {
    flex-direction: row;
    justify-content: space-around;
  }

  .menu {
    display: none;
  }

  .sidebar__links {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: auto;
  }

  .sidebar__links.active {
    display: flex;
  }

  .sidebar__item {
    margin: 15px;
    padding: 15px;
    text-align: left;
  }
}
</style>
