<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { useId } from "radix-vue";
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

const { handleBlur, handleChange, handleReset, errorMessage } =
  useField<string>(() => props.name);

const isHidden = ref(true);
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <Label :for="id">
      {{ props.label }}
    </Label>
    <div class="relative">
      <input
        class="h-10 w-full rounded-full border border-zinc-200 px-4 text-sm font-medium outline-none ring-indigo-200 transition-[border-color,box-shadow] placeholder:text-zinc-400 focus-visible:border-indigo-300 focus-visible:ring-2 aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-200 aria-[invalid=true]:focus-visible:border-red-300"
        :aria-invalid="errorMessage ? 'true' : 'false'"
        :id="id"
        :name="props.name"
        :type="isHidden ? 'password' : 'text'"
        autocomplete="off"
        :placeholder="props.placeholder"
        @change="handleChange"
        @blue="handleBlur"
        @reset="handleReset"
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
    <span v-if="errorMessage" class="block text-xs text-red-600">
      {{ errorMessage }}
    </span>
  </div>
</template>
@/components/ui/label
