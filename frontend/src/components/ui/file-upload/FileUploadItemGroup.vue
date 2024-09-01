<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { inject } from "vue";
import { FILE_UPLOAD_ROOT_CONTEXT } from "./FileUpload.vue";

const props = withDefaults(defineProps<PrimitiveProps>(), { as: "ul" });

const rootContext = inject(FILE_UPLOAD_ROOT_CONTEXT);
if (!rootContext) {
	throw new Error(
		`Failed to inject Symbol(${FILE_UPLOAD_ROOT_CONTEXT.description})`,
	);
}
</script>

<template>
	<Primitive v-bind="props">
		<slot :files="rootContext!.files.value" />
	</Primitive>
</template>
