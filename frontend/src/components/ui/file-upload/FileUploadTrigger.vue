<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { inject } from "vue";
import { FILE_UPLOAD_ROOT_CONTEXT } from "./FileUpload.vue";

const props = withDefaults(defineProps<PrimitiveProps>(), {
	as: "button",
});

const rootContext = inject(FILE_UPLOAD_ROOT_CONTEXT);
</script>

<template>
	<Primitive
		type="button"
		@click="rootContext?.clickHiddenInput()"
		v-bind="props"
	>
		<slot />
	</Primitive>
</template>
