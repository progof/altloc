<script setup lang="ts">
import { useId, Label } from "radix-vue";
import { useField } from "vee-validate";
import type { InputTypeHTMLAttribute } from "vue";

const props = defineProps<{
  name: string;
  label: string;
  placeholder?: string;
  type?: InputTypeHTMLAttribute;
  autocomplete?: string;
}>();

const id = useId();

const { value, errorMessage } = useField<string>(() => props.name);
</script>

<template>
  <div class="flex flex-col">
    <Label class="mb-1.5 text-sm font-medium text-zinc-600" :for="id">
      {{ props.label }}
    </Label>
    <input
      class="h-10 rounded-full border border-zinc-300 px-4 text-sm outline-none transition-[border-color,box-shadow] placeholder:text-zinc-400 focus-visible:border-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-200"
      :id="id"
      :name="props.name"
      :type="props.type"
      :autocomplete="props.autocomplete"
      :placeholder="props.placeholder"
      v-model="value"
    />
    <span v-if="errorMessage" class="mt-1.5 block text-xs text-green-600">
      {{ errorMessage }}
    </span>
  </div>
</template>
