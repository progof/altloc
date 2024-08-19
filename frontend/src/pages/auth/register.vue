<script setup lang="ts">
import RegisterFormIsland from "@/components/RegisterFormIsland.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import GoogleIcon from "@/assets/icons/google.svg?component";
// import { useGoogleAuth } from "@/services/auth.google.service";

// const { redirectToGoogle, isLoading, isError, error } = useGoogleAuth();

// const handleGoogleAuth = async () => {
//   try {
//     await redirectToGoogle();
//   } catch (err) {
//     console.error("Error during Google auth:", err);
//   }
// };
</script>

<template>
  <AuthLayout>
    <div class="flex w-full max-w-lg flex-col gap-y-6 xl:py-20">
      <div class="w-full">
        <h1 class="text-2xl font-bold tracking-[-0.015em]">
          Create your personal account
        </h1>
        <p class="mt-2 text-sm font-medium text-zinc-500">
          Become part of a community of gamify life
        </p>
      </div>
      <div class="flex flex-col items-center gap-y-2">
        <RegisterFormIsland />
        <span class="text-sm text-zinc-500">or</span>
        <a
          type="button"
          href="/api/auth/google"
          class="flex h-11 w-full items-center justify-center rounded-full border border-zinc-100 bg-zinc-100 px-5 transition-colors hover:border-zinc-300 hover:bg-white"
        >
          <GoogleIcon class="mr-2 size-4" />
          <span class="font-medium text-zinc-950">Sign up with Google</span>
        </a>
        <span class="mt-2 flex text-[13px] font-medium">
          Already have an account?&nbsp;<a
            class="text-indigo-600 underline-offset-2 hover:underline"
            href="/auth/login"
          >
            Log in
          </a>
        </span>
      </div>
    </div>
  </AuthLayout>
</template>
