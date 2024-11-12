<script setup lang="ts">
import { computed } from "vue";
import { PaginationLast, type PaginationLastProps } from "radix-vue";
import ArrowRightDoubleIcon from "@/assets/icons/arrowRightDouble.svg?component";
import { Button } from "@/components/ui/button";
import { twMerge, type ClassNameValue } from "tailwind-merge";

const props = withDefaults(
  defineProps<PaginationLastProps & { class?: ClassNameValue }>(),
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
  <PaginationLast v-bind="delegatedProps">
    <Button :class="twMerge('h-10 w-10 p-0', props.class)" variant="secondary">
      <slot>
        <ArrowRightDoubleIcon class="h-4 w-4 text-zinc-500" />
      </slot>
    </Button>
  </PaginationLast>
</template>
