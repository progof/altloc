<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { inject } from "vue";
import { FILE_UPLOAD_ITEM_CONTEXT } from "./FileUploadItem.vue";
import { FILE_UPLOAD_ROOT_CONTEXT } from "./FileUpload.vue";

const props = withDefaults(defineProps<PrimitiveProps>(), {
	as: "button",
});

const itemContext = inject(FILE_UPLOAD_ITEM_CONTEXT);
const rootContext = inject(FILE_UPLOAD_ROOT_CONTEXT);
</script>

<template>
	<Primitive
		type="button"
		@click="
			() => {
				if (!itemContext || !rootContext) return;
				rootContext.setFiles(
					rootContext.files.value.filter(
						(file) => file !== itemContext!.file.value,
					),
				);
			}
		"
		v-bind="props"
	>
		<slot />
	</Primitive>
</template>
