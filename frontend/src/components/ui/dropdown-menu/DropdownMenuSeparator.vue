<script setup lang="ts">
import { computed } from "vue";
import {
	DropdownMenuSeparator,
	type DropdownMenuSeparatorProps,
} from "radix-vue";
import { twMerge, type ClassNameValue } from "tailwind-merge";

const props = defineProps<
	DropdownMenuSeparatorProps & {
		class?: ClassNameValue;
	}
>();

const classes = computed(() => {
	return twMerge("-mx-1 my-1 h-px bg-zinc-200", props.class);
});
</script>

<template>
	<DropdownMenuSeparator v-bind="{ ...props, class: classes }" />
</template>
