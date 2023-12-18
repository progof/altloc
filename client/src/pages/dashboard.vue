<script setup lang="ts">
import { getMeQueryOptions, useLogoutMutation } from "@/services/auth.service";
import { useQuery } from "@tanstack/vue-query";
import { useRouter } from "vue-router";

const { data: me } = useQuery(getMeQueryOptions);

const { mutate: logout } = useLogoutMutation();

const router = useRouter();
</script>

<template>
	<div>
		<h1>Hi, {{ me?.username }} 👋</h1>
		<span>Your Email: {{ me?.email }}</span>
		<span>Account status: {{ me?.is_verified ? "verified" : "not verified" }}</span>
		<button
			@click="
				logout(undefined, {
					onSuccess: () => {
						router.push('/');
					},
				})
			"
		>
			Logout
		</button>
	</div>
</template>
