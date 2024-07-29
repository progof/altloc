<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { useLoginMutation } from "@/services/auth.service";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { TextField, PasswordField } from "@/components/ui/input";
import LoaderIcon from "@/assets/icons/loader.svg?component";

const router = useRouter();

const validationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

const validationErrors = ref<{
  email?: string;
  password?: string;
}>({});

const { mutate: login, isPending, error } = useLoginMutation();

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
    validationErrors.value.password = error.issues.find(
      (issue) => issue.path[0] === "password"
    )?.message;
    return;
  }
  validationErrors.value = {};

  login(result.data, {
    onSuccess: () => {
      router.push("/dashboard");
    },
  });
};
</script>

<template>
  <form @submit.prevent="submitForm" class="w-full">
    <div class="flex flex-col gap-y-3">
      <TextField
        name="email"
        label="Email"
        type="email"
        placeholder="johndoe@example.com"
        autocomplete="email"
      />

      <PasswordField name="password" label="Password" />
      <span v-if="error" class="text-red-500">{{ error }}</span>
    </div>
    <button
      type="submit"
      :disabled="isPending"
      class="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-indigo-500 px-5 font-medium text-white transition-colors hover:bg-indigo-600/90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <LoaderIcon
        class="mr-2 size-5 animate-spin stroke-[1.5] text-white"
        v-if="isPending"
      />
      {{ isPending ? "Logging in..." : "Log in" }}
    </button>
  </form>
</template>
