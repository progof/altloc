<script setup lang="ts">
import { useId, Label } from "radix-vue";
import { useField } from "vee-validate";
import { ref } from "vue";
import EyeIcon from "@/assets/icons/eye.svg?component";
import EyeOffIcon from "@/assets/icons/eye-off.svg?component";

const props = defineProps<{
  name: string;
  label: string;
  placeholder?: string;
}>();

const id = useId();

const { value, errorMessage } = useField<string>(() => props.name);

const isHidden = ref(true);
</script>

<template>
  <div class="flex flex-col">
    <Label class="mb-1.5 text-sm font-medium text-zinc-600" :for="id">
      {{ props.label }}
    </Label>
    <div class="relative">
      <input
        class="h-10 w-full rounded-full border border-zinc-300 px-4 pr-12 text-sm outline-none transition-[border-color,box-shadow] placeholder:text-zinc-400 focus-visible:border-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-200"
        :id="id"
        :name="props.name"
        :type="isHidden ? 'password' : 'text'"
        autocomplete="off"
        :placeholder="props.placeholder"
        v-model="value"
      />
      <button
        type="button"
        class="absolute right-2.5 top-1/2 -translate-y-1/2 p-2"
        @click="isHidden = !isHidden"
      >
        <component
          class="size-5 text-zinc-500"
          :is="isHidden ? EyeIcon : EyeOffIcon"
        />
      </button>
    </div>
    <span v-if="errorMessage" class="mt-1.5 block text-xs text-red-600">
      {{ errorMessage }}
    </span>
  </div>
</template>
