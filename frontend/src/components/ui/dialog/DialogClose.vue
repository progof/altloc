<script setup lang="ts">
import { DialogClose, type DialogCloseProps } from "radix-vue";
import CloseIcon from "@/assets/icons/close.svg?component";
import { twMerge, type ClassNameValue } from "tailwind-merge";

const props = defineProps<DialogCloseProps & { class?: ClassNameValue }>();
</script>

<template>
  <DialogClose
    v-bind="{
      ...props,
      class: twMerge(
        'absolute right-4 top-4 rounded-sm opacity-75 transition-opacity hover:opacity-100 outline-none focus-visible:ring-2 focus-visible:ring-white/20',
        props.class
      ),
    }"
  >
    <CloseIcon class="size-5 stroke-[1.5] text-zinc-500" />
  </DialogClose>
</template>
