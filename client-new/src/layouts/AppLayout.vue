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
  <header
    class="pointer-events-auto flex bg-indigo-200 md:justify-center items-center p-3"
  >
    <MobileMenu class="md:hidden" />
    <div class="gap-3 items-center hidden md:flex md:justify-between">
      <RouterLink
        to="/dashboard"
        class="flex justify-center items-center text-zinc-700 p-2 text-sm no-underline rounded-md transition-colors duration-300 hover:bg-indigo-300 hover:text-[#12171e] gap-3"
      >
        <DashboardIcon class="size-5 stroke-[1.5]" />
        Dashboard
      </RouterLink>
      <RouterLink
        to="/dashboard"
        class="flex justify-center items-center text-zinc-700 p-2 text-sm no-underline rounded-md transition-colors duration-300 hover:bg-indigo-300 hover:text-[#12171e] gap-3"
      >
        <SpacesIcon class="size-5 stroke-[1.5]" />
        Spaces
      </RouterLink>
      <RouterLink
        to="/dashboard"
        class="flex justify-center items-center text-zinc-700 p-2 text-sm no-underline rounded-md transition-colors duration-300 hover:bg-indigo-300 hover:text-[#12171e] gap-3"
      >
        <FeedIcon class="size-5 stroke-[1.5]" />
        Feed
      </RouterLink>
      <RouterLink
        to="/dashboard"
        class="flex justify-center items-center text-zinc-700 p-2 text-sm no-underline rounded-md transition-colors duration-300 hover:bg-indigo-300 hover:text-[#12171e] gap-3"
      >
        <MessageIcon class="size-5 stroke-[1.5]" />
        Message
      </RouterLink>
      <RouterLink
        to="/dashboard"
        class="flex justify-center items-center text-zinc-700 p-2 text-sm no-underline rounded-md transition-colors duration-300 hover:bg-indigo-300 hover:text-[#12171e] gap-3"
      >
        <SettingsIcon class="size-5 stroke-[1.5]" />
        Setting
      </RouterLink>
      <button
        class="flex justify-center items-center p-2 text-sm no-underline rounded-md transition-colors duration-300 hover:bg-indigo-300 text-zinc-700 gap-3"
        @click="logoutUser"
      >
        <LogOutIcon class="size-5 stroke-[1.5]" />
        Log out
      </button>
    </div>
  </header>
  <!-- <div class="flex-1 overflow-y-scroll flex">
    <div class="container w-full md:w-2/3">
      <div class="p-6 h-full bg-indigo-50 text-zinc-500 m-auto w-full flex">
        <slot />
      </div>
    </div>
  </div> -->
  <div class="relative flex flex-1 flex-col bg-zinc-50">
    <slot />
  </div>
</template>
