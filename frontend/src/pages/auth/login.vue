<script setup lang="ts">
// import LoginFormIsland from "@/components/LoginFormIsland.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import GoogleIcon from "@/assets/icons/google.svg?component";
import { ref } from "vue";
import { z } from "zod";
import { useLoginMutation } from "@/services/auth.password.service";
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
      router.push("/user/day-quest");
    },
  });
};
</script>

<template>
  <AuthLayout>
    <div class="flex w-full max-w-lg flex-col gap-y-6">
      <div class="w-full">
        <h1 class="text-2xl font-bold tracking-[-0.015em]">
          Login to your account
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

            <PasswordField name="password" label="Password" />
            <span v-if="error" class="text-red-500">{{ error }}</span>
          </div>
          <Button
            type="submit"
            :disabled="isPending"
            class="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-indigo-500 px-5 font-medium text-white transition-colors hover:bg-indigo-600/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LoaderIcon
              class="mr-2 size-5 animate-spin stroke-[1.5] text-white"
              v-if="isPending"
            />
            {{ isPending ? "Logging in..." : "Log in" }}
          </Button>
        </form>
        <span class="text-sm text-zinc-500">or</span>
        <a
          href="/api/auth/google"
          class="flex h-11 w-full items-center justify-center rounded-full border border-zinc-100 bg-zinc-100 px-5 transition-colors hover:border-zinc-300 hover:bg-white"
        >
          <GoogleIcon class="mr-2 size-4" />
          <span class="font-medium text-zinc-950">Login with Google</span>
        </a>
        <span class="mt-2 flex text-[13px] font-medium">
          Don't have an account yet?&nbsp;<a
            class="text-indigo-600 underline-offset-2 hover:underline"
            href="/auth/register"
            >Sign up</a
          >
        </span>
        <span class="mt-2 flex text-[13px] font-medium">
          Forgot your password?&nbsp;<a
            class="text-indigo-600 underline-offset-2 hover:underline"
            href="/auth/recovery-password"
            >Recover password</a
          >
        </span>
      </div>
    </div>
  </AuthLayout>
</template>
