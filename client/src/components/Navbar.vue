<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
	<div class="navbar">
		<div @click="$router.push('/')">
			<h1>{Xnote} 📚</h1>
		</div>
		<div class="navbar__btns">
			<RouterLink to="/register" class="btn">Register</RouterLink>
			<RouterLink style="margin-left: 20px" to="/login" class="btn">Login</RouterLink>
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

h1 {
  color: rgb(51, 101, 101);
}

span {
  display: block;
  margin-bottom: 10px;
  color: teal;
}

.btn {
  background-color: teal;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 5px;
}
</style>
