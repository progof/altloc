<script setup lang="ts">
import { computed } from "vue";
import { PaginationFirst, type PaginationFirstProps } from "radix-vue";
import ArrowLeftDoubleIcon from "@/assets/icons/arrowLeftDouble.svg?component";
import { Button } from "@/components/ui/button";
import { twMerge, type ClassNameValue } from "tailwind-merge";

const props = withDefaults(
  defineProps<PaginationFirstProps & { class?: ClassNameValue }>(),
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
  <PaginationFirst v-bind="delegatedProps">
    <Button :class="twMerge('h-10 w-10 p-0', props.class)" variant="secondary">
      <slot>
        <ArrowLeftDoubleIcon class="h-4 w-4 text-zinc-500" />
      </slot>
    </Button>
  </PaginationFirst>
</template>
