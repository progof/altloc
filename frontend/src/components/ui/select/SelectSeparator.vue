<script setup lang="ts">
import { SelectSeparator, type SelectSeparatorProps } from "radix-vue";
import { twMerge, type ClassNameValue } from "tailwind-merge";

const props = defineProps<SelectSeparatorProps & { class?: ClassNameValue }>();
</script>

<template>
	<SelectSeparator
		v-bind="{
			...props,
			class: twMerge('-mx-1 my-1 h-px bg-zinc-200', props.class),
		}"
	/>
</template>
