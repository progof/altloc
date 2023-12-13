<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
	<div class="navbar">
		<div @click="$router.push('/')">Xnote</div>
		<div class="navbar__btns">
			<RouterLink to="/register">Register</RouterLink>
			<RouterLink style="margin-left: 20px" to="/login">Login</RouterLink>
		</div>
	</div>
</template>

<style scoped>
.navbar {
	height: 50px;
	background-color: lightgrey;
	box-shadow: 2px 2px 4px gray;
	display: flex;
	align-items: center;
	padding: 0 15px;
}

.navbar__btns {
	margin-left: auto;
}
</style>
