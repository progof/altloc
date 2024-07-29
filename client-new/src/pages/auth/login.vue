<script setup lang="ts">
import LoginFormIsland from "@/components/LoginFormIsland.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
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
        <LoginFormIsland />
        <!-- <span class="text-sm text-zinc-500">or</span>
        <a
          href="/api/auth/google"
          class="flex h-11 w-full items-center justify-center rounded-full border border-zinc-100 bg-zinc-100 px-5 transition-colors hover:border-zinc-300 hover:bg-white"
        >
          <Icon class="mr-2 size-4" name="google" />
          <span class="font-medium text-zinc-950">Login with Google</span>
        </a> -->
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
