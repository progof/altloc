<script setup lang="ts">
import { twMerge, type ClassNameValue } from "tailwind-merge";

const props = defineProps<{ class?: ClassNameValue }>();
</script>

<template>
	<td
		:class="
			twMerge(
				'whitespace-nowrap px-5 py-4 align-middle group-first:first:rounded-tl-md group-first:last:rounded-tr-md group-last:first:rounded-bl-md group-last:last:rounded-br-md',
				props.class,
			)
		"
	>
		<slot />
	</td>
</template>
