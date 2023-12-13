<script setup lang="ts">
import { ref } from "vue";
import { ZodIssue, z } from "zod";

const validationSchema = z
	.object({
		username: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
		password2: z.string().min(6),
	})
	.refine((data) => data.password === data.password2, "Password doesn't match");

const validationErrors = ref<ZodIssue[]>([]);
const isFetching = ref(false);
const error = ref<string | null>(null);

const submitForm = async (event: Event) => {
	try {
		const rawData = Object.fromEntries(
			new FormData(event.target as HTMLFormElement)
		);

		const result = validationSchema.safeParse(rawData);
		if (!result.success) {
			validationErrors.value = result.error.issues;
			return;
		}

		isFetching.value = true;
		const response = await fetch("http://localhost:3000/auth/register", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(result.data),
		});

		if (!response.ok) {
			error.value = await response.text();
		}
	} finally {
		isFetching.value = false;
	}
};
</script>

<template>
	<form @submit.prevent="submitForm">
		<fieldset>
			<label for="username">Username:</label>
			<input type="text" id="username" name="username" />
		</fieldset>

		<fieldset>
			<label for="email">Email:</label>
			<input type="email" id="email" name="email" />
		</fieldset>

		<fieldset>
			<label for="password">Password:</label>
			<input type="password" id="password" name="password" />
		</fieldset>

		<fieldset>
			<label for="password2">Confirm Password:</label>
			<input type="password" id="password2" name="password2" />
		</fieldset>

		<span v-for="error in validationErrors">
			{{ error.message }}
		</span>
		<span v-if="error">{{ error }}</span>

		<button type="submit" :disabled="validationErrors.length > 0 || isFetching">
			{{ isFetching ? "Fetching..." : "Register" }}
		</button>
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
