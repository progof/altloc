<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  color: "green" | "blue" | "black";
}>();

const colorClasses = computed(() => {
  const color = props.color || "black";
  const colors = {
    green: "border-green-500 border text-green-500",
    blue: "border-indigo-600  border text-indigo-600",
    black: "border-zinc-900  border text-zinc-900",
  };
  return colors[color];
});
</script>

<template>
  <span
    class="inline-block rounded-md px-2 py-1 text-sm font-medium"
    :class="colorClasses"
  >
    <slot />
  </span>
</template>
