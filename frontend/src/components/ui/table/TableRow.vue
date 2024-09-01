<script setup lang="ts">
import { twMerge, type ClassNameValue } from "tailwind-merge";

const props = defineProps<{ class?: ClassNameValue }>();
</script>

<template>
	<tr
		:class="
			twMerge(
				'group border-b border-zinc-200 last:border-0 hover:bg-zinc-50',
				props.class,
			)
		"
	>
		<slot />
	</tr>
</template>
