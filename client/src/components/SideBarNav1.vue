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
  <div class="sidebar" :class="{ active: isSidebarActive }">
    <div class="sidebar__item menu" v-if="isSidebarActive">
      <a href="#" @click="toggleSidebar" id="btn">
        <MenuIcon class="icons" />
      </a>
    </div>

    <RouterLink to="/dashboard" class="sidebar__item">
      <DashboardIcon class="icons" />
      Dashboard
    </RouterLink>
    <RouterLink to="#" class="sidebar__item">
      <SpacesIcon class="icons" />
      Spaces
    </RouterLink>
    <RouterLink to="/notes/feed" class="sidebar__item">
      <FeedIcon class="icons" />
      Feed
    </RouterLink>
    <RouterLink to="/notes/add" class="sidebar__item">
      <AddNoteIcon class="icons" />
      Add note
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
</template>

<style scoped>
.sidebar {
  width: 100vw;
  display: flex;
  background-color: rgba(15, 14, 14, 0.9);
  justify-content: space-around;
  align-items: center;
}

.menu {
  display: none;
}
.sidebar__item {
  margin: 15px;
  display: flex;
  align-items: center;
  color: aliceblue;
  padding: 15px;
  font-size: 15px;
  text-decoration: none;
}

.sidebar__item:hover {
  background-color: rgb(55, 146, 225);
  color: #12171e;
  border-radius: 12px;
}

.wrapper {
  padding: 10px;
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
  .sidebar {
    display: flex;
    flex-direction: column;
  }

  .menu {
    display: flex;
    justify-content: flex-end;
    margin-right: 15px;
  }
}
</style>
