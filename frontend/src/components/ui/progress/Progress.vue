<script setup lang="ts">
import { cn } from "@/utils";
import {
  ProgressIndicator,
  ProgressRoot,
  type ProgressRootProps,
} from "radix-vue";
import { computed, type HTMLAttributes } from "vue";

const props = withDefaults(
  defineProps<ProgressRootProps & { class?: HTMLAttributes["class"] }>(),
  {
    modelValue: 0,
  }
);

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <ProgressRoot
    v-bind="delegatedProps"
    :class="
      cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-zinc-200',
        props.class
      )
    "
  >
    <ProgressIndicator
      class="bg-blue-300 rounded-full w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
      :style="`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`"
    />
  </ProgressRoot>
</template>
