<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { useId } from "radix-vue";
import { useField } from "vee-validate";
import DatePicker from "@vuepic/vue-datepicker";

const props = defineProps<{
  name: string;
  label: string;
}>();

const id = useId();

const { value, errorMessage, handleBlur, handleChange, handleReset } = useField(
  () => props.name
);
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <Label :for="id">
      {{ props.label }}
    </Label>

    <DatePicker
      :id="id"
      :model="value"
      :name="props.name"
      @change="handleChange"
      @blur="handleBlur"
      @reset="handleReset"
    />

    <span v-if="errorMessage" class="block text-xs text-red-600">
      {{ errorMessage }}
    </span>
  </div>
</template>
@/components/ui/label
