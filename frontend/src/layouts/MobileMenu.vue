<script setup lang="ts">
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTrigger,
  Separator,
  Toggle,
} from "radix-vue";
import { ref } from "vue";
import { buttonVariant } from "@/components/ui/button";
import TelegramIcon from "@/assets/icons/telegram.svg?component";
import InstagramIcon from "@/assets/icons/instagram.svg?component";
import FacebookIcon from "@/assets/icons/facebook.svg?component";
import XIcon from "@/assets/icons/x.svg?component";
import BurgerToggle from "./BurgerToggle.vue";

const isOpen = ref(false);

const menuItems: {
  label: string;
  href: string;
}[] = [
  {
    label: "To organizers",
    href: "#",
  },
  {
    label: "For partners",
    href: "#",
  },
  {
    label: "User agreement",
    href: "#",
  },
];

const legalMenuItems = [
  {
    label: "Privacy Policy",
    href: "#",
  },
  {
    label: "Terms of Service",
    href: "#",
  },
];

const socialItems = [
  {
    label: "Facebook",
    icon: FacebookIcon,
    href: "#",
  },
  {
    label: "Instagram",
    icon: InstagramIcon,
    href: "#",
  },
  {
    label: "Telegram",
    icon: TelegramIcon,
    href: "#",
  },
  {
    label: "X",
    icon: XIcon,
    href: "#",
  },
];
</script>

<template>
  <DialogRoot v-model:open="isOpen">
    <DialogTrigger as-child>
      <Toggle
        :pressed="isOpen"
        class="pointer-events-auto rounded p-1.5 text-stone-200 outline-none ring-white/25 hover:text-stone-50 focus-visible:ring-2 md:hidden"
      >
        <BurgerToggle v-model="isOpen" class="text-zinc-200 font-semibold" />
      </Toggle>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />
      <DialogContent
        :aria-describedby="undefined"
        @interact-outside.prevent
        @focus-outside.prevent
        @pointer-down-outside.prevent
        class="fixed inset-y-0 left-0 top-[65px] z-10 w-screen gap-4 bg-blue-700 bg-opacity-80 px-6 backdrop-blur ease-out data-[state=closed]:duration-300 data-[state=open]:duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2 md:px-10"
      >
        <div class="flex flex-col">
          <div class="flex justify-center gap-6 p-6">
            <a
              :class="buttonVariant({ variant: 'primary', class: 'flex-1' })"
              href="/auth/register"
            >
              Sign up
            </a>

            <a
              :class="
                buttonVariant({
                  size: 'md',
                  variant: 'secondary',
                  class: 'flex-1 ',
                })
              "
              href="/auth/login"
            >
              Log in
            </a>
          </div>

          <Separator class="my-2 h-px w-full bg-zinc-300" />
          <a
            v-for="item of menuItems"
            :href="item.href"
            class="py-3 font-medium text-zinc-200"
          >
            {{ item.label }}
          </a>
          <Separator class="my-2 h-px w-full bg-zinc-300" />
          <a
            v-for="item of legalMenuItems"
            :href="item.href"
            class="py-3 font-medium text-zinc-200"
          >
            {{ item.label }}
          </a>
          <Separator class="my-2 h-px w-full bg-zinc-300" />
          <ul class="flex gap-1 py-3">
            <li v-for="item of socialItems">
              <a :href="item.href" class="flex p-1">
                <component :is="item.icon" class="h-8 w-8 text-zinc-200" />
              </a>
            </li>
          </ul>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
