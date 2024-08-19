<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { useLoginMutation } from "@/services/auth.service";
import { useRouter } from "vue-router";
import MyButton from "@/components/UI/MyButton.vue";

const router = useRouter();

const validationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
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
      router.push("/feed");
    },
  });
};
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <form
      @submit.prevent="submitForm"
      class="w-full max-w-md p-6 bg-black/90 rounded-2xl"
    >
      <fieldset class="mb-6">
        <label for="email" class="block mb-2 text-white">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          class="w-full p-3 mb-4 bg-black text-white border-2 border-blue-500 rounded focus:border-green-500"
        />
        <span v-if="validationErrors.email" class="text-red-500">{{
          validationErrors.email
        }}</span>
      </fieldset>

      <fieldset class="mb-6">
        <label for="password" class="block mb-2 text-white">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          class="w-full p-3 mb-4 bg-black text-white border-2 border-blue-500 rounded focus:border-green-500"
        />
        <span v-if="validationErrors.password" class="text-red-500">{{
          validationErrors.password
        }}</span>
      </fieldset>

      <span v-if="error" class="text-red-500">{{ error }}</span>
      <div class="button-wrapper flex flex-col items-center">
        <MyButton
          type="submit"
          :disabled="isPending"
          class="w-full bg-green-500 text-white py-3 rounded mb-4"
        >
          {{ isPending ? "Fetching..." : "Login" }}
        </MyButton>
        <MyButton
          @click="$router.push(`/recovery-password`)"
          class="w-full bg-green-500 text-white py-3 rounded"
        >
          Forgot password?
        </MyButton>
      </div>
    </form>
  </div>
</template>
