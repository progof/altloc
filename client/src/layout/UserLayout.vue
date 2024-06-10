<script setup lang="ts">
import SideBarNav from "@/components/SideBarNav.vue";
</script>

<template>
  <SideBarNav />
  <div
    class="max-w-screen-lg p-6 h-full bg-[rgba(15,14,14,0.9)] text-white m-auto"
  >
    <slot />
  </div>
</template>
