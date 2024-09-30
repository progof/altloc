<script setup lang="ts">
import TelegramIcon from "@/assets/icons/telegram.svg?component";
import InstagramIcon from "@/assets/icons/instagram.svg?component";
import FacebookIcon from "@/assets/icons/facebook.svg?component";
import XIcon from "@/assets/icons/x.svg?component";
import MapIcon from "@/assets/icons/map.svg?component";
import { buttonVariant } from "@/components/ui/button";
import { getSoialMediaURL } from "@/utils";
</script>

<template>
  <header
    class="pointer-events-auto sticky top-0 z-20 bg-blue-300 bg-opacity-90 px-6 py-3 backdrop-blur-[20px] backdrop-saturate-150 md:px-14"
  >
    <div class="container flex items-center justify-between gap-6">
      <div class="flex gap-1 items-center">
        <span class="font-semibold text-xl text-zinc-800">AltLoc</span>
        <MapIcon class="size-7 stroke-[1.7] text-zinc-800" />
      </div>

      <div class="flex gap-1 justify-center md:justify-end">
        <a
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
        </a>
        <a
          :class="
            buttonVariant({ size: 'md', class: 'shrink-0', variant: 'primary' })
          "
          href="/auth/register"
        >
          Register
        </a>
      </div>
    </div>
  </header>

  <main class="relative flex flex-1 flex-col bg-blue-50">
    <slot />
  </main>
  <footer class="bg-blue-300 px-6 md:px-10">
    <div class="container flex flex-col">
      <div class="flex flex-col items-start gap-4 py-6 md:gap-2 md:py-4">
        <div
          class="flex w-full flex-col items-start justify-center gap-3 text-center md:flex-row md:items-center md:justify-between"
        >
          <span class="text-center text-lg font-medium text-zinc-700">
            AltLoc
          </span>
          <ul
            class="flex flex-wrap items-start justify-start gap-x-5 gap-y-2 md:justify-between"
          >
            <li>
              <a
                href="/organizers"
                class="text-sm text-zinc-700/75 hover:text-zinc-700"
              >
                To organizers
              </a>
            </li>
            <li>
              <a href="#" class="text-sm text-zinc-700/75 hover:text-zinc-700">
                For partners
              </a>
            </li>
            <li>
              <a href="#" class="text-sm text-zinc-700/75 hover:text-zinc-700">
                User agreement
              </a>
            </li>
          </ul>
        </div>
        <div class="flex flex-row justify-center gap-1 md:justify-end">
          <a
            :href="getSoialMediaURL('telegram')"
            class="flex p-1 text-zinc-700/75 hover:text-zinc-700/90"
          >
            <TelegramIcon class="size-5" />
          </a>
          <a
            :href="getSoialMediaURL('instagram')"
            class="flex p-1 text-zinc-700/75 hover:text-zinc-700/90"
          >
            <InstagramIcon class="size-5" />
          </a>
          <a
            :href="getSoialMediaURL('facebook')"
            class="flex p-1 text-zinc-700/75 hover:text-zinc-700/90"
          >
            <FacebookIcon class="size-5" />
          </a>
          <a
            :href="getSoialMediaURL('twitter')"
            class="flex p-1 text-zinc-700/75 hover:text-zinc-700/90"
          >
            <XIcon class="size-5" />
          </a>
        </div>
      </div>

      <div
        class="flex flex-col justify-between gap-2 border-t border-zinc-700/25 py-4 sm:flex-row"
      >
        <div class="inline-flex gap-1.5 text-zinc-700/75">
          <span class="text-xs">
            Copyright &copy; {{ new Date().getFullYear() }}
          </span>
          <span class="text-xs">&bull;</span>
          <span class="text-xs">All Rights Reserved</span>
        </div>
        <div class="inline-flex gap-1.5 text-zinc-700/75">
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
