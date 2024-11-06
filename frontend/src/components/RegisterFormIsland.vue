<script setup lang="ts">
import { ref } from "vue";
import { ZodIssue, z } from "zod";
import { useRegisterMutation } from "@/services/auth.password.service";
import { Button } from "@/components/ui/button";
import { TextField, PasswordField } from "@/components/ui/input";
import LoaderIcon from "@/assets/icons/loader.svg?component";

const validationSchema = z
  .object({
    username: z.string().min(1).max(255),
    email: z.string().email(),
    password: z.string().min(6).max(255),
    password_confirmation: z.string().min(6).max(255),
  })
  .refine(
    (data) => data.password === data.password_confirmation,
    "Passwords don't match"
  );

const validationErrors = ref<ZodIssue[]>([]);
const successMessage = ref<string | null>(null);
const registerError = ref<string | null>(null);

const { mutate: register, isPending } = useRegisterMutation();

const submitForm = async (event: Event) => {
  event.preventDefault();
  const rawData = Object.fromEntries(
    new FormData(event.target as HTMLFormElement)
  );

  const result = validationSchema.safeParse(rawData);
  if (!result.success) {
    validationErrors.value = result.error.issues;
    return;
  }

  validationErrors.value = [];

  register(result.data, {
    onSuccess: () => {
      successMessage.value =
        "Registration successful! Please confirm your email.";
      registerError.value = null;
    },
    onError: (err) => {
      registerError.value =
        err.message || "Registration failed. Please try again.";
      successMessage.value = null;
    },
  });
};
</script>

<template>
  <form @submit="submitForm" class="w-full">
    <div class="flex flex-col gap-y-3 flex-1">
      <TextField
        name="username"
        label="Username"
        placeholder="John Doe"
        type="text"
        autocomplete="username"
        class="text-zinc-400"
      />
      <TextField
        name="email"
        label="Email"
        placeholder="johndoe@example.com"
        type="email"
        autocomplete="email"
        class="text-zinc-400"
      />
      <PasswordField name="password" label="Password" class="text-zinc-400" />
      <PasswordField
        name="password_confirmation"
        label="Confirm password"
        class="text-zinc-400"
      />
    </div>

    <div>
      <span
        v-for="error in validationErrors"
        :key="error.message"
        class="text-red-500 block"
      >
        {{ error.message }}
      </span>
      <span v-if="registerError" class="text-red-500">{{ registerError }}</span>
    </div>

    <div v-if="successMessage" class="text-green-500 text-center mb-4">
      {{ successMessage }}
    </div>

    <Button
      type="submit"
      :disabled="isPending"
      class="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-blue-500 px-5 font-medium text-white transition-colors hover:bg-blue-600/90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <LoaderIcon
        class="mr-2 size-5 animate-spin stroke-[1.5] text-zinc-400"
        v-if="isPending"
      />
      {{ isPending ? "Registering..." : "Create account" }}
    </Button>
  </form>
</template>
