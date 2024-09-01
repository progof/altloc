<script setup lang="ts">
import { twMerge, type ClassNameValue } from "tailwind-merge";

const props = defineProps<{ class?: ClassNameValue }>();
</script>

<template>
	<table
		:class="twMerge('w-full min-w-full caption-bottom text-base', props.class)"
	>
		<slot />
	</table>
</template>
