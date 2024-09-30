<script setup lang="ts">
import ProfileDropdownMenu from "@/layouts/ProfileDropdownMenu.vue";
import { getMeQueryOptions } from "@/services/user.service";
import { useQuery } from "@tanstack/vue-query";
import MapIcon from "@/assets/icons/map.svg?component";
import DiamondIcon from "@/assets/icons/diamond.svg?component";

const { data: user } = useQuery(getMeQueryOptions);
</script>

<template>
  <header
    class="pointer-events-auto flex bg-blue-300 md:justify-center items-center p-3 px-6"
  >
    <div class="flex justify-between items-center flex-1">
      <div class="flex gap-1 items-center">
        <span class="font-semibold text-xl text-zinc-700">AltLoc</span>
        <MapIcon class="size-7 stroke-[1.7] text-zinc-700" />
      </div>

      <div class="flex items-center gap-3">
        <div class="flex gap-1" title="Score">
          <DiamondIcon class="size-6 stroke-[1.7] text-zinc-700" />
          <span class="text-zinc-700">{{ user?.score }}</span>
        </div>
        <ProfileDropdownMenu v-if="user" :user="user" class="md:hidden" />
      </div>
    </div>
  </header>
  <div class="relative flex flex-1 flex-col bg-blue-50 h-screen">
    <slot />
  </div>
</template>
