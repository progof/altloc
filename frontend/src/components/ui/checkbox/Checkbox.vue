<script setup lang="ts">
import { CheckboxRoot, CheckboxIndicator } from "radix-vue";
import CheckIcon from "@/assets/icons/check.svg?component";
import { twMerge, type ClassNameValue } from "tailwind-merge";

const props = defineProps<{ class?: ClassNameValue }>();
const checked = defineModel<boolean>({ default: false });
</script>

<template>
  <CheckboxRoot
    v-model:checked="checked"
    :class="
      twMerge(
        'relative inline-flex size-4 shrink-0 items-center justify-center rounded-[3px] border border-zinc-300 outline-none ring-zinc-300/75 transition-[box-shadow] hover:bg-white/5 focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-500 data-[state=checked]:focus-within:ring-indigo-500/40',
        props.class
      )
    "
  >
    <CheckboxIndicator>
      <CheckIcon class="pointer-events-none size-3 stroke-[1.75] text-white" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
