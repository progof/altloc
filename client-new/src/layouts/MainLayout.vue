<script setup lang="ts">
import TelegramIcon from "@/assets/icons/telegram.svg?component";
import InstagramIcon from "@/assets/icons/instagram.svg?component";
import FacebookIcon from "@/assets/icons/facebook.svg?component";
import XIcon from "@/assets/icons/x.svg?component";
import { buttonVariant } from "@/components/ui/button";
</script>

<template>
  <header
    class="pointer-events-auto sticky top-0 z-20 bg-indigo-200 bg-opacity-90 px-6 py-3 backdrop-blur-[20px] backdrop-saturate-150 md:px-14"
  >
    <div class="container flex items-center justify-between gap-6">
      <span class="text-center text-base text-zinc-700 font-semibold">
        ISotus
      </span>

      <div class="flex gap-1 justify-center md:justify-end">
        <a
          :class="
            buttonVariant({
              size: 'md',
              variant: 'secondary',
              class: 'shrink-0',
            })
          "
          href="/auth/login"
        >
          Log in
        </a>
        <a
          :class="buttonVariant({ size: 'md', class: 'shrink-0' })"
          href="/auth/register"
        >
          Register
        </a>
      </div>
    </div>
  </header>

  <main class="relative flex flex-1 flex-col bg-zinc-50">
    <slot />
  </main>
  <footer class="bg-indigo-200 md:px-14 py-3 px-6">
    <div class="flex flex-col">
      <div
        class="mb-4 mt-2 flex flex-col justify-center gap-3 text-center md:flex-row md:justify-between"
      >
        <span class="text-center text-base text-zinc-700 font-semibold">
          ISotus
        </span>
        <div
          class="flex flex-col items-center justify-center gap-6 md:flex-row md:justify-end"
        >
          <a href="#" class="text-sm text-zinc-700">Privacy policy</a>
          <a href="#" class="text-sm text-zinc-700">Terms of service</a>
          <a href="#" class="text-sm text-zinc-700">About us</a>
        </div>
      </div>
      <div class="mt-1 flex flex-row justify-center gap-3 py-2 md:justify-end">
        <a href="#"><TelegramIcon class="size-6" /></a>
        <a href="#"><InstagramIcon class="size-6" /></a>
        <a href="#"><FacebookIcon class="size-6" /></a>
        <a href="#"><XIcon class="size-6" /></a>
      </div>
      <div
        class="mt-2 flex flex-col items-center justify-center border-t-2 border-zinc-400 py-2 text-center md:flex-row md:justify-between"
      >
        <div class="inline-block">
          <span class="pr-2 text-[12px] text-zinc-700"
            >Copyright &copy; {{ new Date().getFullYear() }}</span
          >
          <span class="text-[12px] text-zinc-700">&bull;</span>
          <span class="pl-2 text-[12px] text-zinc-700"
            >All Rights Reserved</span
          >
        </div>
        <div class="inline-block">
          <a href="#" class="pr-2 text-[12px] text-zinc-700">Privacy Policy</a>
          <span class="text-[12px] text-zinc-700">&bull;</span>
          <a href="#" class="pl-2 text-[12px] text-zinc-700">
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
@/components/ui/button
