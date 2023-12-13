<script setup lang="ts">
import { ref } from "vue";
import { ZodError, z } from "zod";

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

const form = ref({
	email: "",
	password: "",
});

const errors = ref<{
	email?: string;
	password?: string;
}>({});

const submitForm = async (event: Event) => {
	try {
		const rawData = Object.fromEntries(
			new FormData(event.target as HTMLFormElement)
		);

		const validData = schema.parse(rawData);

		const response = await fetch("http://localhost:3000/auth/login", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(validData),
		});
		if (response.ok) {
			// Registration successful
			console.log("Login successful");
		} else {
			// Registration failed
			console.error("Login failed");
		}
	} catch (error) {
		if (error instanceof ZodError) {
			errors.value.email = error.issues.find(
				(issue) => issue.path[0] === "email"
			)?.message;
			errors.value.password = error.issues.find(
				(issue) => issue.path[0] === "password"
			)?.message;
		}
	}
};
</script>

<template>
	<form @submit.prevent="submitForm">
		<div>
			<label for="email">Email:</label>
			<input v-model="form.email" type="email" id="email" />
			<span v-if="errors.email">{{ errors.email }}</span>
		</div>

		<div>
			<label for="password">Password:</label>
			<input v-model="form.password" type="password" id="password" />
			<span v-if="errors.password">{{ errors.password }}</span>
		</div>

		<button type="submit">Login</button>
	</form>
</template>

<style scoped>
form {
	max-width: 300px;
	margin: auto;
	padding: 20px;
	border: 1px solid #ccc;
	border-radius: 5px;
}

label {
	display: block;
	margin-bottom: 5px;
}

input {
	width: 100%;
	padding: 8px;
	margin-bottom: 10px;
	box-sizing: border-box;
}

button {
	background-color: #4caf50;
	color: white;
	padding: 10px 15px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
}
</style>
