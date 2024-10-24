<script setup lang="ts">
import TelegramIcon from "@/assets/icons/telegram.svg?component";
import InstagramIcon from "@/assets/icons/instagram.svg?component";
import FacebookIcon from "@/assets/icons/facebook.svg?component";
import XIcon from "@/assets/icons/x.svg?component";
import AstronautIcon from "@/assets/icons/astronaut.svg?component";
import { buttonVariant } from "@/components/ui/button";
import { getSoialMediaURL } from "@/utils";
import MobileMenu from "./MobileMenu.vue";
</script>

<template>
  <header
    class="pointer-events-auto sticky top-0 z-20 bg-blue-700 bg-opacity-80 px-6 py-3 backdrop-blur-[20px] backdrop-saturate-150 md:px-14"
  >
    <div class="container flex items-center justify-between gap-6">
      <div class="flex gap-1 items-center">
        <span class="font-semibold text-xl text-zinc-100">AltLoc</span>
        <AstronautIcon class="size-10 stroke-[4] text-zinc-100" />
      </div>

      <div class="flex gap-6 justify-center md:justify-end">
        <!-- <a
          :class="
            buttonVariant({
              size: 'md',
              variant: 'secondary',
              class: 'shrink-0 text-red-500',
            })
          "
          href="/auth/login"
        >
          Log in
        </a> -->
        <a
          :class="
            buttonVariant({
              size: 'md',
              class: 'shrink-0',
              variant: 'primary',
            })
          "
          href="/auth/register"
        >
          Get started
        </a>
        <MobileMenu />
      </div>
    </div>
  </header>

  <main class="relative flex flex-1 flex-col bg-blue-50">
    <slot />
  </main>
  <footer class="bg-blue-700 px-6 md:px-10">
    <div class="container flex flex-col">
      <div class="flex flex-col items-start gap-4 py-6 md:gap-2 md:py-4">
        <div
          class="flex w-full flex-col items-start justify-center gap-3 text-center md:flex-row md:items-center md:justify-between"
        >
          <div class="flex gap-1 items-center">
            <span class="font-semibold text-xl text-zinc-100">AltLoc</span>
            <AstronautIcon class="size-10 stroke-[4] text-zinc-100" />
          </div>
          <ul
            class="flex flex-wrap items-start justify-start gap-x-5 gap-y-2 md:justify-between"
          >
            <li>
              <a
                href="/organizers"
                class="text-sm text-zinc-100/75 hover:text-zinc-100"
              >
                To organizers
              </a>
            </li>
            <li>
              <a href="#" class="text-sm text-zinc-100/75 hover:text-zinc-100">
                For partners
              </a>
            </li>
            <li>
              <a href="#" class="text-sm text-zinc-100/75 hover:text-zinc-100">
                User agreement
              </a>
            </li>
          </ul>
        </div>
        <div class="flex flex-row justify-center gap-1 md:justify-end">
          <a
            :href="getSoialMediaURL('telegram')"
            class="flex p-1 text-zinc-100/75 hover:text-zinc-100/90"
          >
            <TelegramIcon class="size-5" />
          </a>
          <a
            :href="getSoialMediaURL('instagram')"
            class="flex p-1 text-zinc-100/75 hover:text-zinc-100/90"
          >
            <InstagramIcon class="size-5" />
          </a>
          <a
            :href="getSoialMediaURL('facebook')"
            class="flex p-1 text-zinc-100/75 hover:text-zinc-100/90"
          >
            <FacebookIcon class="size-5" />
          </a>
          <a
            :href="getSoialMediaURL('twitter')"
            class="flex p-1 text-zinc-100/75 hover:text-zinc-100/90"
          >
            <XIcon class="size-5" />
          </a>
        </div>
      </div>

      <div
        class="flex flex-col justify-between gap-2 border-t border-zinc-100/25 py-4 sm:flex-row"
      >
        <div class="inline-flex gap-1.5 text-zinc-100/75">
          <span class="text-xs">
            Copyright &copy; {{ new Date().getFullYear() }}
          </span>
          <span class="text-xs">&bull;</span>
          <span class="text-xs">All Rights Reserved</span>
        </div>
        <div class="inline-flex gap-1.5 text-zinc-100/75">
          <a href="#" class="text-xs underline-offset-2 hover:underline">
            Privacy Policy
          </a>
          <span class="text-xs">&bull;</span>
          <a href="#" class="text-xs underline-offset-2 hover:underline">
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
