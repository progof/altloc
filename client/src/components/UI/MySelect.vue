<script setup lang="ts">
defineProps<{
	options: { name: string; value: string }[];
}>();
const value = defineModel<string>({ default: "" });
</script>

<template>
	<select v-model="value">
		<option disabled value="">Select from the list</option>
		<option v-for="option in options" :key="option.value" :value="option.value">
			{{ option.name }}
		</option>
	</select>
</template>
