<script setup lang="ts">
import AuthLayout from "@/layouts/AuthLayout.vue";
import { useResetPasswordEmailMutation } from "@/services/auth.password.service";
import { z, ZodIssue } from "zod";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/input";

const router = useRouter();

const rawParams = Object.fromEntries(new URLSearchParams(location.search));

const parsedParams = z
  .object({
    user_id: z.string(),
    reset_token: z.string(),
  })
  .parse(rawParams);

const {
  mutate: resetPasswordEmail,
  isPending,
  error,
} = useResetPasswordEmailMutation();

const validationSchema = z
  .object({
    password: z.string().min(6),
    password_confirmation: z.string().min(6),
  })
  .refine(
    (data) => data.password === data.password_confirmation,
    "Password doesn't match"
  );

const validationErrors = ref<ZodIssue[]>([]);
const successMessage = ref<string | null>(null);

const submitForm = async (event: Event) => {
  const rawData = Object.fromEntries(
    new FormData(event.target as HTMLFormElement)
  );

  const result = validationSchema.safeParse(rawData);
  if (!result.success) {
    validationErrors.value = result.error.issues;
    return;
  }

  const passwordResetData = {
    user_id: parsedParams.user_id,
    reset_token: parsedParams.reset_token,
    password: result.data.password,
    password_confirmation: result.data.password_confirmation,
  };

  resetPasswordEmail(passwordResetData, {
    onSuccess: () => {
      successMessage.value =
        "Password has been successfully reset. You will be redirected to the login page in 6 seconds.";
      setTimeout(() => {
        router.push("/auth/login");
      }, 6000); // Redirect after 6 seconds
    },
  });
};
</script>

<template>
  <AuthLayout>
    <div class="flex w-full max-w-lg flex-col gap-y-6">
      <div class="w-full">
        <h1 class="text-2xl font-bold tracking-[-0.015em]">Reset password</h1>
      </div>
      <div class="flex w-full flex-col items-center gap-y-2">
        <form @submit.prevent="submitForm" class="w-full">
          <div class="flex flex-col gap-y-3">
            <PasswordField name="password" label="Password" />
            <PasswordField
              name="password_confirmation"
              label="Confirm password"
            />
          </div>
          <span v-if="error" class="text-red-400 text-center">{{ error }}</span>
          <span v-if="successMessage" class="text-green-300 text-center">
            {{ successMessage }}
          </span>
          <Button type="submit" :disabled="isPending">
            {{ isPending ? "Fetching..." : "Reset password" }}
          </Button>
        </form>
      </div>
    </div>
  </AuthLayout>
</template>
@/services/auth.password.service
