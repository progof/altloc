<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import { RouterView } from "vue-router";
</script>

<template>
	<Navbar />
	<div class="app">
		<RouterView />
	</div>
</template>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

.app {
	padding: 20px;
}
</style>
