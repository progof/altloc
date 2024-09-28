<script setup lang="ts">
import { computed } from "vue";
import { DropdownMenuItem, type DropdownMenuItemProps } from "radix-vue";
import { twMerge, type ClassNameValue } from "tailwind-merge";

const props = defineProps<DropdownMenuItemProps & { class?: ClassNameValue }>();

const classes = computed(() => {
  return twMerge(
    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm font-medium outline-none focus:bg-zinc-200 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    props.class
  );
});
</script>

<template>
  <DropdownMenuItem v-bind="{ ...props, class: classes }">
    <slot />
  </DropdownMenuItem>
</template>
