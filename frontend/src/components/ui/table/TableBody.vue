<script setup lang="ts">
import { twMerge, type ClassNameValue } from "tailwind-merge";
import { computed } from "vue";

const props = defineProps<{ class?: ClassNameValue }>();

const classes = computed(() => {
	return twMerge(
		"before:block before:leading-[8px] before:content-['-'] before:invisible",
		props.class,
	);
});
</script>

<template>
	<tbody :class="classes">
		<slot />
	</tbody>
</template>
