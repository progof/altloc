<script setup lang="ts">
import {
	DialogContent,
	useEmitAsProps,
	DialogPortal,
	DialogOverlay,
	type DialogContentProps,
	type DialogContentEmits,
} from "radix-vue";
import { twMerge, type ClassNameValue } from "tailwind-merge";
import { computed } from "vue";

const props = defineProps<{ class?: ClassNameValue } & DialogContentProps>();

const emit = defineEmits<DialogContentEmits>();
const emitsAsProps = useEmitAsProps(emit);

const classes = computed(() => {
	return twMerge(
		"fixed left-0 right-0 top-0 z-20 mx-auto mt-[min(40px,5svh)] flex max-h-[85vh] w-[90vw] max-w-lg flex-col rounded-xl bg-white p-6 shadow-lg outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
		props.class,
	);
});

defineOptions({ inheritAttrs: false });
</script>

<template>
	<DialogPortal>
		<DialogOverlay
			class="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
		/>
		<DialogContent
			v-bind="{ ...props, ...emitsAsProps, ...$attrs, class: classes }"
		>
			<slot />
		</DialogContent>
	</DialogPortal>
</template>
