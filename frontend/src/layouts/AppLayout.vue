<script setup lang="ts">
import ProfileDropdownMenu from "@/layouts/ProfileDropdownMenu.vue";
import { getMeQueryOptions } from "@/services/user.service";
import { useQuery } from "@tanstack/vue-query";
import AstronautIcon from "@/assets/icons/astronaut.svg?component";

const { data: user } = useQuery(getMeQueryOptions);
</script>

<template>
  <header
    class="pointer-events-auto flex bg-blue-700 md:justify-center items-center p-3 px-6 md:px-10"
  >
    <div class="flex justify-between items-center flex-1">
      <div class="flex gap-2 items-center">
        <AstronautIcon class="size-10 stroke-[4] text-zinc-100" />
        <span class="font-semibold text-xl text-zinc-100">ALTLOC</span>
      </div>

      <ProfileDropdownMenu v-if="user" :user="user" class="md:hidden" />
    </div>
  </header>
  <div class="relative flex flex-1 flex-col bg-blue-50 h-screen">
    <slot />
  </div>
</template>
