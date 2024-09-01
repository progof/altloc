<script setup lang="ts">
import { inject, onUnmounted, ref, watch } from "vue";
import { FILE_UPLOAD_ITEM_CONTEXT } from "./FileUploadItem.vue";

const itemContext = inject(FILE_UPLOAD_ITEM_CONTEXT);
if (!itemContext) {
	throw new Error(
		`Failed to inject Symbol(${FILE_UPLOAD_ITEM_CONTEXT.description})`,
	);
}

const url = ref<string | null>(null);

watch(
	itemContext.file,
	() => {
		if (url.value) {
			URL.revokeObjectURL(url.value);
			url.value = null;
		}

		try {
			url.value = URL.createObjectURL(itemContext.file.value);
		} catch (error) {
			console.error(error);
		}
	},
	{ immediate: true },
);

onUnmounted(() => {
	if (url.value) URL.revokeObjectURL(url.value);
});
</script>

<template>
	<slot :url="url" />
</template>
