<script setup lang="ts">
import { useResetPasswordEmailMutation } from "@/services/auth.service";
import { z, ZodIssue } from "zod";
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import MyButton from "@/components/UI/MyButton.vue";

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
    password2: z.string().min(6),
  })
  .refine((data) => data.password === data.password2, "Password doesn't match");

const validationErrors = ref<ZodIssue[]>([]);

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
    password2: result.data.password2,
  };

  resetPasswordEmail(passwordResetData, {
    onSuccess: () => {
      router.push("/login"); // Redirect to the login page after successful password change
    },
  });
};
</script>

<template>
  <div
    class="pt-64 max-w-3xl mx-auto w-full h-screen flex flex-col items-center justify-center"
  >
    <form
      @submit.prevent="submitForm"
      class="max-w-md mx-auto p-8 rounded-md bg-black"
    >
      <fieldset class="mb-4">
        <label for="password" class="block mb-2 text-white"
          >New Password:</label
        >
        <input
          type="password"
          id="password"
          name="password"
          class="w-full p-2 mb-2 bg-black text-white border-2 border-blue-600 rounded"
        />
      </fieldset>

      <fieldset class="mb-4">
        <label for="password2" class="block mb-2 text-white"
          >Confirm new password:</label
        >
        <input
          type="password"
          id="password2"
          name="password2"
          class="w-full p-2 mb-2 bg-black text-white border-2 border-blue-600 rounded"
        />
      </fieldset>

      <span v-if="error" class="text-red-500">{{ error }}</span>

      <MyButton type="submit" :disabled="isPending">
        {{ isPending ? "Fetching..." : "Reset password" }}
      </MyButton>
    </form>
    <p v-if="isPending" class="text-white">Reset your email...</p>
    <p v-else-if="error" class="text-red-500">
      {{ error }}
    </p>
    <div v-else class="text-center">
      <h2 class="text-white">Password successfully changed!</h2>
      <RouterLink to="/login" class="text-blue-500 underline">Login</RouterLink>
    </div>
  </div>
</template>
