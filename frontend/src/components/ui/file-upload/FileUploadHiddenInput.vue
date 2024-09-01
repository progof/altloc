<script setup lang="ts">
import { inject } from "vue";
import { VisuallyHidden } from "radix-vue";
import { FILE_UPLOAD_ROOT_CONTEXT } from "./FileUpload.vue";

const rootContext = inject(FILE_UPLOAD_ROOT_CONTEXT);
</script>

<template>
	<VisuallyHidden as-child>
		<input
			:ref="
				(element) =>
					rootContext?.setHiddenInput((element as HTMLInputElement) || null)
			"
			tabindex="-1"
			type="file"
		/>
	</VisuallyHidden>
</template>
