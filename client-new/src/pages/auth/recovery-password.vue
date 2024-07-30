<script setup lang="ts">
import AuthLayout from "@/layouts/AuthLayout.vue";
import { ref } from "vue";
import { z } from "zod";
import { useRecoveryPasswordMutation } from "@/services/auth.password.service";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/input";

const validationSchema = z.object({
  email: z.string().email(),
});

const validationErrors = ref<{
  email?: string;
}>({});

const successMessage = ref<string | null>(null);
const recoverError = ref<string | null>(null);

const {
  mutate: recovery_password,
  isPending,
  error,
} = useRecoveryPasswordMutation();

const submitForm = async (event: Event) => {
  const rawData = Object.fromEntries(
    new FormData(event.target as HTMLFormElement)
  );

  const result = validationSchema.safeParse(rawData);
  if (!result.success) {
    const error = result.error;
    validationErrors.value.email = error.issues.find(
      (issue) => issue.path[0] === "email"
    )?.message;
    return;
  }
  validationErrors.value = {};

  recovery_password(result.data, {
    onSuccess: () => {
      successMessage.value =
        "Password recovery email sent. Please check your inbox.";
      recoverError.value = null;
    },
    onError: (err) => {
      recoverError.value =
        err.message || "Password recovery failed. Please try again.";
      successMessage.value = null;
    },
  });
};
</script>

<template>
  <AuthLayout>
    <div class="flex w-full max-w-lg flex-col gap-y-6">
      <div class="w-full">
        <h1 class="text-2xl font-bold tracking-[-0.015em]">
          Recovery password
        </h1>
      </div>
      <div class="flex w-full flex-col items-center gap-y-2">
        <form @submit.prevent="submitForm" class="w-full">
          <div class="flex flex-col gap-y-3">
            <TextField
              name="email"
              label="Email"
              type="email"
              placeholder="johndoe@example.com"
              autocomplete="email"
            />

            <span v-if="error" class="text-red-400 text-center">{{
              error
            }}</span>
            <span v-if="successMessage" class="text-green-400 text-center">
              {{ successMessage }}
            </span>
            <span v-if="recoverError" class="text-red-400 text-center">
              {{ recoverError }}
            </span>
          </div>

          <Button type="submit" :disabled="isPending">
            {{ isPending ? "Fetching..." : "Reset password" }}
          </Button>
        </form>
      </div>
    </div>
  </AuthLayout>
</template>
@/services/auth.password.service
