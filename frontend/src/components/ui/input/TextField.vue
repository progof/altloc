<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { useId } from "radix-vue";
import { useField } from "vee-validate";

const props = defineProps<{
  name: string;
  label: string;
  placeholder?: string;
  autocomplete?: string;
  type?: string;
}>();

const id = useId();

const { errorMessage, handleBlur, handleChange, handleReset, value } =
  useField<string>(() => props.name);
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <Label :for="id">
      {{ props.label }}
    </Label>
    <input
      class="h-10 rounded-full border border-zinc-200 px-4 text-sm font-medium outline-none ring-indigo-200 transition-[border-color,box-shadow] placeholder:text-zinc-400 focus-visible:border-indigo-300 focus-visible:ring-2 aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-200 aria-[invalid=true]:focus-visible:border-red-300"
      :aria-invalid="errorMessage ? 'true' : 'false'"
      :id="id"
      :value="value"
      :name="props.name"
      :type="props.type"
      :autocomplete="props.autocomplete"
      :placeholder="props.placeholder"
      @change="handleChange"
      s
      @blue="handleBlur"
      @reset="handleReset"
    />
    <span v-if="errorMessage" class="block text-xs text-red-600 mt-2">
      {{ errorMessage }}
    </span>
  </div>
</template>
