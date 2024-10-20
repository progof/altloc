<script setup lang="ts">
import {
	SelectContent,
	type SelectContentEmits,
	type SelectContentProps,
	SelectPortal,
	SelectViewport,
	useEmitAsProps,
} from "radix-vue";
import { twMerge, type ClassNameValue } from "tailwind-merge";
import { computed } from "vue";

const props = withDefaults(
	defineProps<SelectContentProps & { class?: ClassNameValue }>(),
	{
		position: "item-aligned",
		sideOffset: 4,
		avoidCollisions: true,
	},
);
const emit = defineEmits<SelectContentEmits>();
const emitAsProps = useEmitAsProps(emit);

const classes = computed(() => {
	return twMerge(
		"relative z-50 min-w-[10rem] overflow-hidden rounded-md border border-zinc-200 bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
		props.position === "popper" &&
			"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
		props.class,
	);
});

defineOptions({ inheritAttrs: false });
</script>

<template>
	<SelectPortal>
		<SelectContent
			style=""
			v-bind="{
				...props,
				...emitAsProps,
				...$attrs,
				style:
					'box-shadow: 0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08);',
				class: classes,
			}"
		>
			<SelectViewport
				:class="[
					'p-1',
					position === 'popper' &&
						'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
				]"
			>
				<slot />
			</SelectViewport>
		</SelectContent>
	</SelectPortal>
</template>
