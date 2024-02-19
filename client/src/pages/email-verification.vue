<script setup lang="ts">
import { useVerifyEmailMutation } from "@/services/auth.service";
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
  <div class="wrapper">
    <p v-if="isPending">Verifiying your email...</p>
    <p v-else-if="error">
      {{ error }}
    </p>
    <div v-else>
      <h1>Email successfully verified</h1>
      <RouterLink to="/login">Login</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  padding-top: 265px;
  max-width: 1060px;
  margin: 0 auto;
  width: 100vw;
  height: 100vh;
  color: aliceblue;
}
</style>
