<script setup lang="ts">
import { twMerge, type ClassNameValue } from "tailwind-merge";

const props = defineProps<{ class?: ClassNameValue }>();
</script>

<template>
	<th
		:class="
			twMerge(
				'whitespace-nowrap px-5 py-3 align-middle font-semibold text-zinc-500 first:rounded-l-lg last:rounded-r-lg',
				props.class,
			)
		"
		:style="{
			boxShadow: '0 -1px 0px 0 rgba(0, 0, 0, 0.03) inset',
		}"
	>
		<slot />
	</th>
</template>
