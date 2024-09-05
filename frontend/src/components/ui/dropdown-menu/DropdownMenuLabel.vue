<script setup lang="ts">
import { computed } from "vue";
import { DropdownMenuLabel, type DropdownMenuLabelProps } from "radix-vue";
import { twMerge, type ClassNameValue } from "tailwind-merge";

const props = defineProps<
	DropdownMenuLabelProps & { class?: ClassNameValue; inset?: boolean }
>();

const classes = computed(() => {
	return twMerge("px-2 py-1.5 text-sm font-semibold", props.class);
});
</script>

<template>
	<DropdownMenuLabel v-bind="{ ...props, class: classes }">
		<slot />
	</DropdownMenuLabel>
</template>
