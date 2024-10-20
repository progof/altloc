<script setup lang="ts">
import {
  SelectItem,
  SelectItemIndicator,
  type SelectItemProps,
  SelectItemText,
} from "radix-vue";
import { computed } from "vue";
import CheckIcon from "@/assets/icons/check.svg?component";
import { twMerge, type ClassNameValue } from "tailwind-merge";

const props = defineProps<SelectItemProps & { class?: ClassNameValue }>();

const classes = computed(() => {
  return twMerge(
    "relative flex w-full cursor-default select-none items-center rounded py-1.5 pl-[30px] pr-2 text-sm font-medium outline-none hover:bg-zinc-50 focus:bg-zinc-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    props.class
  );
});
</script>

<template>
  <SelectItem v-bind="{ ...props, class: classes }">
    <span class="absolute left-2 flex size-3.5 items-center justify-center">
      <SelectItemIndicator>
        <CheckIcon class="size-4 stroke-[1.5] text-indigo-500" aria-hidden />
      </SelectItemIndicator>
    </span>
    <SelectItemText>
      <slot />
    </SelectItemText>
  </SelectItem>
</template>
