<script setup lang="ts">
import { useId } from "radix-vue";

const id = useId();
</script>

<template>
	<slot :id="id" />
</template>
