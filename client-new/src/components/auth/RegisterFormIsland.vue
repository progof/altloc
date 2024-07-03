<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import type { ZodIssue } from "zod";
import { useRegisterMutation } from "@/services/auth.service";

const validationSchema = z
  .object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    password2: z.string().min(6),
  })
  .refine((data) => data.password === data.password2, "Passwords don't match");

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
  <div class="wrapper flex items-center justify-center h-screen">
    <form
      @submit="submitForm"
      class="w-full max-w-sm p-12 bg-black/90 rounded-2xl"
    >
      <fieldset class="mb-4">
        <label for="username" class="block mb-2 text-white">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          class="w-full p-2 mb-4 bg-black text-white border-2 border-blue-500 rounded focus:border-green-500"
        />
      </fieldset>

      <fieldset class="mb-4">
        <label for="email" class="block mb-2 text-white">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          class="w-full p-2 mb-4 bg-black text-white border-2 border-blue-500 rounded focus:border-green-500"
        />
      </fieldset>

      <fieldset class="mb-4">
        <label for="password" class="block mb-2 text-white">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          class="w-full p-2 mb-4 bg-black text-white border-2 border-blue-500 rounded focus:border-green-500"
        />
      </fieldset>

      <fieldset class="mb-4">
        <label for="password2" class="block mb-2 text-white"
          >Confirm Password:</label
        >
        <input
          type="password"
          id="password2"
          name="password2"
          class="w-full p-2 mb-4 bg-black text-white border-2 border-blue-500 rounded focus:border-green-500"
        />
      </fieldset>

      <div>
        <span
          v-for="error in validationErrors"
          :key="error.message"
          class="text-red-500 block"
        >
          {{ error.message }}
        </span>
        <span v-if="registerError" class="text-red-500">{{
          registerError
        }}</span>
      </div>

      <div v-if="successMessage" class="text-green-500 text-center mb-4">
        {{ successMessage }}
      </div>

      <button
        type="submit"
        :disabled="isPending"
        class="w-full bg-green-500 text-white py-2 rounded mt-4"
      >
        {{ isPending ? "Registering..." : "Register" }}
      </button>
    </form>
  </div>
</template>
