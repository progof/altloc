<script lang="ts">
import { cva } from "class-variance-authority";
import { cn } from "@/utils";

export const badgeVariant = cva(
  "inline-flex items-center rounded-full border font-semibold outline-none transition-colors",
  {
    variants: {
      size: {
        xs: "h-3.5 px-2 text-[8px]",
        sm: "h-5 px-1.5 text-[10px]",
        md: "h-7 px-2 text-xs",
        lg: "h-10 px-4 text-base",
      },
      variant: {
        green: "border border-green-500 text-green-500",
        blue: "border border-blue-600 text-blue-600",
        black: "border border-zinc-900 text-zinc-900",
        yellow: "border border-yellow-500 text-yellow-500",
        red: "border border-red-500 text-red-500",
      },
    },
    defaultVariants: {
      variant: "green",
      size: "md",
    },
  }
);
</script>

<script setup lang="ts">
const props = defineProps<{
  variant?: "green" | "blue" | "black" | "yellow" | "red";
  size?: "xs" | "sm" | "md" | "lg";
  class?: string;
}>();
</script>

<template>
  <span :class="cn(badgeVariant({ variant, size }), props.class)">
    <slot />
  </span>
</template>
