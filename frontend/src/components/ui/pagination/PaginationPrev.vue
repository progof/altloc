<script setup lang="ts">
import { computed } from "vue";
import { PaginationPrev, type PaginationPrevProps } from "radix-vue";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg?component";
import { Button } from "@/components/ui/button";
import { twMerge, type ClassNameValue } from "tailwind-merge";

const props = withDefaults(
  defineProps<PaginationPrevProps & { class?: ClassNameValue }>(),
  {
    asChild: true,
  }
);

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <PaginationPrev v-bind="delegatedProps">
    <Button :class="twMerge('h-10 w-10 p-0', props.class)" variant="secondary">
      <slot>
        <ChevronUpIcon class="size-5 -rotate-90 stroke-[1.5] text-zinc-500" />
      </slot>
    </Button>
  </PaginationPrev>
</template>
