<script setup lang="ts">
import { useResetPasswordEmailMutation } from "@/services/auth.service";
import { z, ZodIssue } from "zod";
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();

const rawParams = Object.fromEntries(new URLSearchParams(location.search));

const parsedParams = z
  .object({
    user_id: z.string(),
    reset_token: z.string(),
  })
  .parse(rawParams);

const { mutate: resetPasswordEmail, isPending, error } = useResetPasswordEmailMutation();


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

  resetPasswordEmail(
    passwordResetData,
    {
      onSuccess: () => {
        alert("Password successfully changed!");
        router.push("/login"); // Redirect to the login page after successful password change
      },
    }
  );
};

</script>

<template>
  <form @submit.prevent="submitForm">
    <fieldset>
      <label for="password">New Password:</label>
      <input type="password" id="password" name="password" />
    </fieldset>

    <fieldset>
      <label for="password2">Confirm new password:</label>
      <input type="password" id="password2" name="password2" />
    </fieldset>

    <span v-if="error">{{ error }}</span>

    <button type="submit" :disabled="isPending">
      {{ isPending ? "Fetching..." : "Reset password" }}
    </button>
  </form>
  <p v-if="isPending">Reset your email...</p>
  <p v-else-if="error">
    {{ error }}
  </p>
  <div v-else>
    <h1>Password successfully changed!</h1>
    <RouterLink to="/login">Login</RouterLink>
  </div>
</template>

<style scoped>
form {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  box-sizing: border-box;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

fieldset {
  border: none;
}
</style>
