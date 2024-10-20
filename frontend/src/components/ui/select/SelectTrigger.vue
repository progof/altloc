<script setup lang="ts">
import { SelectIcon, SelectTrigger, type SelectTriggerProps } from "radix-vue";
import SelectIconSvg from "@/assets/icons/select.svg?component";
import { computed } from "vue";
import { twMerge, type ClassNameValue } from "tailwind-merge";

const props = defineProps<
  SelectTriggerProps & { class?: ClassNameValue; invalid?: boolean }
>();

const classes = computed(() => {
  return twMerge(
    "flex h-10 w-full items-center justify-between rounded-full border border-zinc-200 px-4 text-sm font-medium outline-none ring-indigo-200 transition-[box-shadow,border-color] hover:border-zinc-300 focus-visible:border-indigo-300 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-200 aria-[invalid=true]:focus-visible:border-red-300 data-[placeholder]:text-zinc-400",
    props.class
  );
});
</script>

<template>
  <SelectTrigger
    v-bind="{
      ...$props,
      class: classes,
      'aria-invalid': props.invalid ? 'true' : 'false',
    }"
  >
    <slot />
    <SelectIcon as-child>
      <SelectIconSvg
        aria-hidden
        :class="['size-4 stroke-[1.5] text-zinc-400']"
      />
    </SelectIcon>
  </SelectTrigger>
</template>
