<script lang="ts">
import { cva } from "class-variance-authority";
import { twMerge, type ClassNameValue } from "tailwind-merge";

export const buttonVariants = cva(
  "flex items-center justify-center whitespace-nowrap rounded-full font-medium outline-none transition-colors ease-out disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-9 gap-1 px-3.5 text-sm",
        md: "h-10 gap-1.5 px-[18px] text-sm",
        lg: "h-11 gap-1.5 px-4 text-base",
        xl: "h-12 gap-1.5 px-[18px] text-base",
        "2xl": "h-14 gap-2.5 px-[22px] text-lg",
      },
      variant: {
        primary:
          "bg-blue-500 text-zinc-200 hover:bg-blue-600 disabled:bg-zinc-400",
        secondary: "text-zinc-200 hover:bg-blue-500  disabled:bg-zinc-400",
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
const props = defineProps<{
  class?: ClassNameValue;
  variant?: NonNullable<Parameters<typeof buttonVariants>[0]>["variant"];
  size?: NonNullable<Parameters<typeof buttonVariants>[0]>["size"];
}>();
</script>

<template>
  <button :class="twMerge(buttonVariants({ variant, size }), props.class)">
    <slot />
  </button>
</template>
