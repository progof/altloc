<script setup lang="ts">
import { twMerge, type ClassNameValue } from "tailwind-merge";

const props = defineProps<{ class?: ClassNameValue }>();
</script>

<template>
	<thead :class="twMerge('bg-zinc-100 text-sm', props.class)">
		<slot />
	</thead>
</template>
