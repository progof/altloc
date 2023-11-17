<script setup lang="ts">
async function onSubmit(event: Event) {
	const formData = new FormData(event.target as HTMLFormElement);
	const json = Object.fromEntries(formData);

	const res = await fetch("http://localhost:3000/register", {
		method: "POST",
		body: JSON.stringify(json),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		throw new Error(await res.text());
	}

	console.log(await res.text());
}
</script>

<template>
	<form @submit.prevent="onSubmit">
		<input type="email" name="email" />
		<input type="password" name="password" />
		<button type="submit">Register</button>
	</form>
</template>
