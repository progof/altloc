<script lang="ts">
export interface DropZoneProps extends PrimitiveProps {
	dataTypes?: UseDropZoneOptions["dataTypes"];
}

export type DropZoneEmits = {
	drop: Parameters<NonNullable<UseDropZoneOptions["onDrop"]>>;
	enter: Parameters<NonNullable<UseDropZoneOptions["onEnter"]>>;
	leave: Parameters<NonNullable<UseDropZoneOptions["onLeave"]>>;
	over: Parameters<NonNullable<UseDropZoneOptions["onOver"]>>;
};
</script>

<script setup lang="ts">
import { Primitive, type PrimitiveProps, useForwardExpose } from "radix-vue";
import { useDropZone, type UseDropZoneOptions } from "@vueuse/core";

const props = defineProps<DropZoneProps>();

const emit = defineEmits<DropZoneEmits>();

const { currentElement, forwardRef } = useForwardExpose();

const data = useDropZone(currentElement, {
	dataTypes: props.dataTypes,
	onDrop: (files, event) => emit("drop", files, event),
	onEnter: (files, event) => emit("enter", files, event),
	onLeave: (files, event) => emit("leave", files, event),
	onOver: (files, event) => emit("over", files, event),
});
</script>

<template>
	<Primitive :ref="forwardRef" v-bind="props">
		<slot v-bind="data" />
	</Primitive>
</template>
