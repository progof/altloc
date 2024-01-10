<script setup lang="ts">
const value = defineModel<string>({ default: "" });
</script>

<template>
	<input v-model="value" class="input" type="text" />
</template>

<style scoped>
.input {
	width: 100%;
	border: 1px solid teal;
	padding: 10px 15px;
	margin-top: 15px;
}
</style>
