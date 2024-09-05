<script setup lang="ts">
import ProfileDropdownMenu from "@/layouts/ProfileDropdownMenu.vue";
import { getMeQueryOptions } from "@/services/user.service";
import { useQuery } from "@tanstack/vue-query";

const { data: user } = useQuery(getMeQueryOptions);
</script>

<template>
  <header
    class="pointer-events-auto flex bg-indigo-200 md:justify-center items-center p-3"
  >
    <div class="flex justify-between items-center flex-1">
      <span class="font-semibold text-lg text-zinc-800">AltLoc</span>
      <ProfileDropdownMenu v-if="user" :user="user" class="md:hidden" />
    </div>
  </header>
  <div class="relative flex flex-1 flex-col bg-zinc-50">
    <slot />
  </div>
</template>
