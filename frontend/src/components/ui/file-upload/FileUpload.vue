<script lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import {
	computed,
	provide,
	readonly,
	ref,
	watch,
	type InjectionKey,
	type Ref,
} from "vue";

export const FILE_UPLOAD_ROOT_CONTEXT = Symbol(
	"FILE_UPLOAD_ROOT_CONTEXT",
) as InjectionKey<{
	setHiddenInput: (input: HTMLInputElement | null) => void;
	clickHiddenInput: () => void;
	setFiles: (files: File[]) => void;
	files: Readonly<Ref<File[]>>;
}>;
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<PrimitiveProps>(), {
	as: "template",
});

const files = defineModel<File[]>({ default: [] });
const hiddenInput = ref<HTMLInputElement | null>(null);

provide(FILE_UPLOAD_ROOT_CONTEXT, {
	files: readonly(files) as Readonly<Ref<File[]>>,
	setHiddenInput: (element) => {
		hiddenInput.value = element;
	},
	clickHiddenInput: () => {
		hiddenInput.value?.click();
	},
	setFiles: (filesToSet) => {
		if (!hiddenInput.value) return;
		const dataTransfer = new DataTransfer();

		for (const file of filesToSet) {
			dataTransfer.items.add(file);
		}

		hiddenInput.value.files = dataTransfer.files;
		files.value = filesToSet;
	},
});

function handleChange(event: Event) {
	const fileList = (event.target as HTMLInputElement).files;
	if (!fileList) return;

	const _files = Array.from(fileList);
	if (_files.length) {
		files.value = _files;
	}
}

watch(hiddenInput, (hiddenInput) => {
	if (!hiddenInput) return;

	hiddenInput.addEventListener("change", handleChange);
	return () => {
		hiddenInput.removeEventListener("change", handleChange);
	};
});

const file = computed(() => files.value[0] || null);
</script>

<template>
	<Primitive v-bind="props">
		<slot :files="files" :file="file" />
	</Primitive>
</template>
