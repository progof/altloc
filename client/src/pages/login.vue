<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { useLoginMutation } from "@/services/auth.service";
import { useRouter } from "vue-router";
import MyButton from "@/components/UI/MyButton.vue";

const router = useRouter();

const validationSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

const validationErrors = ref<{
	email?: string;
	password?: string;
}>({});

const { mutate: login, isPending, error } = useLoginMutation();

const submitForm = async (event: Event) => {
	const rawData = Object.fromEntries(
		new FormData(event.target as HTMLFormElement)
	);

	const result = validationSchema.safeParse(rawData);
	if (!result.success) {
		const error = result.error;
		validationErrors.value.email = error.issues.find(
			(issue) => issue.path[0] === "email"
		)?.message;
		validationErrors.value.password = error.issues.find(
			(issue) => issue.path[0] === "password"
		)?.message;
		return;
	}
	validationErrors.value = {};

	login(result.data, {
		onSuccess: () => {
			router.push("/dashboard");
		},
	});
};
</script>

<template>
	<form @submit.prevent="submitForm">
		<fieldset>
			<label for="email">Email:</label>
			<input type="email" id="email" name="email" />
			<span v-if="validationErrors.email">{{ validationErrors.email }}</span>
		</fieldset>

		<fieldset>
			<label for="password">Password:</label>
			<input type="password" id="password" name="password" />
			<span v-if="validationErrors.password">{{
				validationErrors.password
			}}</span>
		</fieldset>

		<span v-if="error">{{ error }}</span>

		<my-button type="submit" :disabled="isPending">
			{{ isPending ? "Fetching..." : "Login" }}
		</my-button>
	</form>
	<div>
		<RouterLink to="/recovery-password">Forgot password?</RouterLink>
	</div>
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

fieldset {
	border: none;
}
</style>
