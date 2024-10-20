<script setup lang="ts">
import { type ClassValue, cn } from "@/utils";
import { Label, type LabelProps } from "radix-vue";

const props = defineProps<LabelProps & { class?: ClassValue }>();
</script>

<template>
  <Label
    v-bind="{
      ...props,
      class: cn('font-medium text-[13px] leading-5 text-zinc-500', props.class),
    }"
  >
    <slot />
  </Label>
</template>
