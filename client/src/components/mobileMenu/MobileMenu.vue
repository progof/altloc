<script setup lang="ts">
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTrigger,
} from "radix-vue";

import BurgerToggle from "@/components/mobileMenu/BurgerToggle.vue";
import DashboardIcon from "@/assets/icons/DashboardIcon.svg?component";
import SpacesIcon from "@/assets/icons/SpacesIcon.svg?component";
import LogOutIcon from "@/assets/icons/LogOutIcon.svg?component";
import MessageIcon from "@/assets/icons/MessageIcon.svg?component";
import FeedIcon from "@/assets/icons/FeedIcon.svg?component";
import SettingsIcon from "@/assets/icons/SettingsIcon.svg?component";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useLogoutMutation } from "@/services/auth.service";

const router = useRouter();
const { mutate: logout } = useLogoutMutation();

const logoutUser = () => {
  logout(undefined, {
    onSuccess: () => {
      router.push("/");
    },
  });
};
const isOpen = ref(false);

// const socialItems = [
//   {
//     label: "Facebook",
//     icon: FacebookIcon,
//     href: "#",
//   },
//   {
//     label: "Instagram",
//     icon: InstagramIcon,
//     href: "#",
//   },
//   {
//     label: "LinkedIn",
//     icon: LinkedInIcon,
//     href: "#",
//   },
//   {
//     label: "X",
//     icon: XIcon,
//     href: "#",
//   },
// ];
</script>

<template>
  <DialogRoot v-model:open="isOpen" :modal="true">
    <DialogTrigger as-child>
      <BurgerToggle
        v-model="isOpen"
        class="p-1.5 text-stone-200 hover:text-white md:hidden"
      />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />
      <DialogContent
        :aria-describedby="undefined"
        @interact-outside.prevent
        @focus-outside.prevent
        @pointer-down-outside.prevent
        class="h-[calc(100vh - 60px)] fixed inset-y-0 left-0 top-[60px] z-10 w-screen gap-4 bg-black px-6 backdrop-blur ease-out data-[state=closed]:duration-300 data-[state=open]:duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2 md:px-10"
      >
        <div class="flex flex-col">
          <RouterLink to="/dashboard" class="text-zinc-100 flex gap-3">
            <DashboardIcon class="h-5 w-5" />
            Dashboard
          </RouterLink>
          <RouterLink to="/spaces" class="text-zinc-100 flex gap-3">
            <SpacesIcon class="h-5 w-5" />
            Spaces
          </RouterLink>
          <RouterLink to="/feed" class="text-zinc-100 flex gap-3">
            <FeedIcon class="h-5 w-5" />
            Feed
          </RouterLink>
          <RouterLink to="#" class="text-zinc-100 flex gap-3">
            <MessageIcon class="h-5 w-5" />
            Message
          </RouterLink>
          <RouterLink to="#" class="text-zinc-100 flex gap-3">
            <SettingsIcon class="h-5 w-5" />
            Setting
          </RouterLink>
          <button class="text-zinc-100 flex gap-3" @click="logoutUser">
            <LogOutIcon class="h-5 w-5" />
            Log out
          </button>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
