<script setup lang="ts">
import AuthLayout from "@/layouts/AuthLayout.vue";
import { buttonVariant } from "@/components/ui/button";
import { useVerifyEmailMutation } from "@/services/auth.password.service";
import { z } from "zod";

const rawParams = Object.fromEntries(new URLSearchParams(location.search));

const parsedParams = z
  .object({
    user_id: z.string(),
    activation_token: z.string(),
  })
  .parse(rawParams);

const { mutate: verifyEmail, isPending, error } = useVerifyEmailMutation();

verifyEmail(parsedParams);
</script>

<template>
  <AuthLayout>
    <div class="flex w-full max-w-lg flex-col gap-y-6">
      <div class="w-full">
        <h1 v-if="isPending" class="text-2xl font-bold tracking-[-0.015em]">
          Verifiying your email...
        </h1>
      </div>
      <div class="flex w-full flex-col items-center gap-y-2">
        <span v-if="isPending">Verifiying your email...</span>
        <span v-else-if="error"> {{ error }}s </span>
        <div v-else class="flex-col gap-6">
          <h2 class="text-green-400 font-semibold">
            Email successfully verified
          </h2>
          <a
            :class="
              buttonVariant({
                size: 'md',
                variant: 'secondary',
                class: 'shrink-0',
              })
            "
            href="/auth/login"
          >
            Log in
          </a>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>
