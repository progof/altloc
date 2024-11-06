<script setup lang="ts">
import RegisterFormIsland from "@/components/RegisterFormIsland.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import GoogleIcon from "@/assets/icons/google.svg?component";
</script>

<template>
  <AuthLayout>
    <div class="flex w-full max-w-lg flex-col gap-y-6 xl:py-20">
      <div class="w-full">
        <h1 class="text-2xl font-bold tracking-[-0.015em] text-blue-500">
          Create your personal account
        </h1>
        <p class="mt-2 text-sm font-medium text-zinc-600">
          Become part of a community of gamify life
        </p>
      </div>
      <div class="flex flex-col items-center gap-y-2">
        <RegisterFormIsland />
        <span class="text-sm text-zinc-500">or</span>
        <a
          type="button"
          href="/api/auth/google"
          class="flex h-11 w-full items-center justify-center rounded-full bg-blue-100 px-5 transition-colors hover:border-zinc-200 hover:bg-blue-200"
        >
          <GoogleIcon class="mr-2 size-4" />
          <span class="font-medium text-zinc-600">Sign up with Google</span>
        </a>
        <span class="mt-2 flex text-[13px] font-medium text-zinc-500">
          Already have an account?&nbsp;<a
            class="text-blue-700 underline-offset-2 hover:underline"
            href="/auth/login"
          >
            Log in
          </a>
        </span>
      </div>
    </div>
  </AuthLayout>
</template>
