<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { useField } from "vee-validate";
import { useId } from "radix-vue";

const props = defineProps<{
	name: string;
	label: string;
	placeholder?: string;
}>();

const { handleBlur, handleChange, handleReset, errorMessage, value } =
	useField<string>(() => props.name);

const id = useId();
</script>

<template>
	<div class="flex flex-col gap-1.5">
		<Label :for="id">{{ props.label }}</Label>
		<textarea
			:id="id"
			:name="props.name"
			@change="handleChange"
			@blur="handleBlur"
			@reset="handleReset"
			:value="value"
			:placeholder="props.placeholder"
			style="field-sizing: content; min-height: 4lh; max-height: 10lh"
			:aria-invalid="errorMessage ? 'true' : 'false'"
			class="flex w-full resize-none appearance-none items-center rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 outline-none ring-indigo-200 transition-[box-shadow,border-color,background-color] placeholder:text-zinc-400 focus-visible:border-indigo-300 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-200 aria-[invalid=true]:focus-visible:border-red-300"
		/>
		<span class="block text-xs font-medium text-red-600">
			{{ errorMessage }}
		</span>
	</div>
</template>

<style scoped>
textarea::-webkit-scrollbar {
	width: 10px;
}

textarea::-webkit-scrollbar-thumb {
	border: 3px solid rgba(0, 0, 0, 0);
	background-clip: padding-box;
	border-radius: 9999px;
	background-color: rgb(212 212 216 / 0.5);
}
</style>
