<script setup lang="ts">
import {
  DropdownMenuContent,
  type DropdownMenuContentEmits,
  type DropdownMenuContentProps,
  DropdownMenuPortal,
  useEmitAsProps,
} from "radix-vue";
import { twMerge, type ClassNameValue } from "tailwind-merge";
import { computed } from "vue";

const props = withDefaults(
  defineProps<DropdownMenuContentProps & { class?: ClassNameValue }>(),
  {
    sideOffset: 4,
    avoidCollisions: true,
  }
);
const emit = defineEmits<DropdownMenuContentEmits>();
const emitsAsProps = useEmitAsProps(emit);

const classes = computed(() => {
  return twMerge(
    "pointer-events-auto z-50 flex min-w-32 flex-col overflow-hidden rounded-md border border-zinc-200 p-1 shadow-md will-change-[transform,opacity] focus:outline-none",
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:data-[align=end]:slide-in-from-right-1 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-0 bg-white",
    props.class
  );
});
</script>

<script lang="ts">
export default { inheritAttrs: false };
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent
      v-bind="{
        ...props,
        ...emitsAsProps,
        ...$attrs,
        class: classes,
      }"
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
