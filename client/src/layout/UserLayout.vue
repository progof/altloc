<script setup lang="ts">
import SideBarNav from "@/components/SideBarNav.vue";
</script>

<template>
  <SideBarNav />
  <div class="flex-1 overflow-y-scroll flex">
    <div class="container">
      <div
        class="p-6 h-full bg-[rgba(15,14,14,0.9)] text-white m-auto w-full flex"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
