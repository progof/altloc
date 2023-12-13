<template>
	<div class="navbar">
		<div @click="$router.push('/')">Xnote</div>
		<div class="navbar__btns">
			<my-button @click="$router.push('/register')">Register</my-button>
			<my-button style="margin-left: 20px" @click="$router.push('/login')"
				>Login</my-button
			>
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
