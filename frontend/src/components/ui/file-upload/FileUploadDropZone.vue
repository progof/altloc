<script setup lang="ts">
import { DropZone, type DropZoneProps } from "@/components/ui/drop-zone";
import { inject } from "vue";
import { Primitive } from "radix-vue";
import { FILE_UPLOAD_ROOT_CONTEXT } from "./FileUpload.vue";

const props = defineProps<DropZoneProps>();

const rootContext = inject(FILE_UPLOAD_ROOT_CONTEXT);

function handleDrop(files: File[] | null) {
	if (!files || !rootContext) return;
	rootContext.setFiles(files);
}
</script>

<template>
	<DropZone
		@drop="handleDrop"
		v-slot="{ isOverDropZone }"
		:data-types="props.dataTypes"
		as-child
	>
		<Primitive
			:as="as"
			:as-child="asChild"
			:data-drag-over="isOverDropZone.value"
		>
			<slot />
		</Primitive>
	</DropZone>
</template>
