<script setup lang="ts">
import { Toggle } from "radix-vue";

const pressed = defineModel<boolean>({ required: true });
</script>

<template>
  <Toggle v-model:pressed="pressed" aria-label="Toggle menu">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-6 w-6 text-zinc-50"
    >
      <path v-if="pressed" d="M6 18L18 6M6 6l12 12" />
      <path v-else d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
  </Toggle>
</template>
