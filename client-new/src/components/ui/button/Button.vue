<script lang="ts">
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "flex items-center justify-center whitespace-nowrap rounded-full font-medium outline-none transition-colors ease-out disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 gap-1 px-3 text-sm",
        md: "h-10 gap-1.5 px-4 text-sm",
        lg: "h-11 gap-1.5 px-4 text-base",
        xl: "h-12 gap-1.5 px-[18px] text-base",
        "2xl": "h-14 gap-2.5 px-[22px] text-lg",
      },
      variant: {
        primary:
          "bg-indigo-500 text-white hover:bg-[#5A5CD5] disabled:bg-zinc-400",
        secondary:
          "border hover:border-zinc-50 text-zinc-900 hover:bg-indigo-100",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);
</script>

<script setup lang="ts">
import { cn, type ClassValue } from "@/utils";

const props = defineProps<{
  class?: ClassValue;
  variant?: NonNullable<Parameters<typeof buttonVariants>[0]>["variant"];
  size?: NonNullable<Parameters<typeof buttonVariants>[0]>["size"];
}>();
</script>

<template>
  <button :class="cn(buttonVariants({ variant, size }), props.class)">
    <slot />
  </button>
</template>
