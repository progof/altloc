<script setup lang="ts">
import { useRouter } from "vue-router";
import { useLogoutMutation } from "@/services/auth.service";

import DashboardIcon from "@/assets/icons/DashboardIcon.svg?component";
import SpacesIcon from "@/assets/icons/SpacesIcon.svg?component";
import LogOutIcon from "@/assets/icons/LogOutIcon.svg?component";
import MessageIcon from "@/assets/icons/MessageIcon.svg?component";
import FeedIcon from "@/assets/icons/FeedIcon.svg?component";
import SettingsIcon from "@/assets/icons/SettingsIcon.svg?component";
import MobileMenu from "@/components/mobileMenu/MobileMenu.vue";

const router = useRouter();
const { mutate: logout } = useLogoutMutation();

const logoutUser = () => {
  logout(undefined, {
    onSuccess: () => {
      router.push("/");
    },
  });
};
</script>

<template>
  <div
    class="w-screen flex bg-[rgba(15,14,14,0.9)] justify-between items-center rounded-b-[25px] p-3"
  >
    <MobileMenu class="md:hidden" />
    <div class="gap-3 items-center hidden md:flex">
      <RouterLink
        to="/dashboard"
        class="sidebar__item flex items-center text-white p-3 text-sm no-underline rounded-md transition-colors duration-300 w-32 h-10 hover:bg-blue-600 hover:text-[#12171e]"
      >
        <DashboardIcon class="icons w-6 h-6 mr-2" />
        Dashboard
      </RouterLink>
      <RouterLink
        to="/spaces"
        class="sidebar__item flex items-center text-white p-3 text-sm no-underline rounded-md transition-colors duration-300 w-32 h-10 hover:bg-blue-600 hover:text-[#12171e]"
      >
        <SpacesIcon class="w-6 h-6 mr-2" />
        Spaces
      </RouterLink>
      <RouterLink
        to="/feed"
        class="flex items-center text-white p-3 text-sm no-underline rounded-md transition-colors duration-300 w-32 h-10 hover:bg-blue-600 hover:text-[#12171e]"
      >
        <FeedIcon class="icons w-6 h-6 mr-2" />
        Feed
      </RouterLink>
      <RouterLink
        to="#"
        class="flex items-center text-white p-3 text-sm no-underline rounded-md transition-colors duration-300 w-32 h-10 hover:bg-blue-600 hover:text-[#12171e]"
      >
        <MessageIcon class="icons w-6 h-6 mr-2" />
        Message
      </RouterLink>
      <RouterLink
        to="#"
        class="flex items-center text-white p-3 text-sm no-underline rounded-md transition-colors duration-300 w-32 h-10 hover:bg-blue-600 hover:text-[#12171e]"
      >
        <SettingsIcon class="icons w-6 h-6 mr-2" />
        Setting
      </RouterLink>
      <button
        class="flex items-center text-white p-3 text-sm no-underline rounded-md transition-colors duration-300 w-32 h-10 hover:bg-blue-600 hover:text-[#12171e] bg-[rgba(15,14,14,0.9)]"
        @click="logoutUser"
      >
        <LogOutIcon class="w-6 h-6 mr-2" />
        Log out
      </button>
    </div>
  </div>
</template>
