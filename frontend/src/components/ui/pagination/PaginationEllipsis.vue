<script setup lang="ts">
import { computed } from "vue";
import { PaginationEllipsis, type PaginationEllipsisProps } from "radix-vue";
import MoreHorizontalIcon from "@/assets/icons/more-horizontal.svg?component";
import { twMerge, type ClassNameValue } from "tailwind-merge";

const props = defineProps<
  PaginationEllipsisProps & { class?: ClassNameValue }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <PaginationEllipsis
    v-bind="delegatedProps"
    :class="twMerge('flex h-9 w-9 items-center justify-center', props.class)"
  >
    <slot>
      <MoreHorizontalIcon class="h-4 w-4 text-zinc-500" />
    </slot>
  </PaginationEllipsis>
</template>
