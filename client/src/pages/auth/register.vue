<script setup lang="ts">
import { ref } from "vue";
import { ZodIssue, z } from "zod";
import { useRegisterMutation } from "@/services/auth.service";
import MyButton from "@/components/UI/MyButton.vue";

const validationSchema = z
  .object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    password2: z.string().min(6),
  })
  .refine((data) => data.password === data.password2, "Password doesn't match");

const validationErrors = ref<ZodIssue[]>([]);

const { mutate: register, isPending, error } = useRegisterMutation();

const submitForm = async (event: Event) => {
  const rawData = Object.fromEntries(
    new FormData(event.target as HTMLFormElement)
  );

  const result = validationSchema.safeParse(rawData);
  if (!result.success) {
    validationErrors.value = result.error.issues;
    return;
  }

  register(result.data);
};
</script>

<template>
  <div class="wrapper">
    <form @submit.prevent="submitForm">
      <fieldset>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" />
      </fieldset>

      <fieldset>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" />
      </fieldset>

      <fieldset>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" />
      </fieldset>

      <fieldset>
        <label for="password2">Confirm Password:</label>
        <input type="password" id="password2" name="password2" />
      </fieldset>

      <span v-for="error in validationErrors">
        {{ error.message }}
      </span>
      <span v-if="error">{{ error }}</span>

      <MyButton
        type="submit"
        :disabled="validationErrors.length > 0 || isPending"
      >
        {{ isPending ? "Fetching..." : "Register" }}
      </MyButton>
    </form>
  </div>
</template>

<!-- <style scoped>
.wrapper {
  padding-top: 265px;
  max-width: 1060px;
  margin: 0 auto;
  width: 100vw;
  height: 100vh;
}

form {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border: 0px solid #ccc;
  border-radius: 15px;
  background-color: black;
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
  background-color: rgb(0, 0, 0);
  color: aliceblue;
  border: 2px solid rgb(55, 146, 225);
  border-radius: 4px;
}

fieldset {
  border: none;
}
</style> -->

<style scoped>
.wrapper {
  padding-top: 20vh;
  max-width: 1060px;
  margin: 0 auto;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  max-width: 300px;
  width: 90%;
  padding: 20px;
  border: 0px solid #ccc;
  border-radius: 15px;
  background-color: black;
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
  background-color: rgb(0, 0, 0);
  color: aliceblue;
  border: 2px solid rgb(55, 146, 225);
  border-radius: 4px;
}

fieldset {
  border: none;
}

/* Media Queries */
@media screen and (min-width: 600px) {
  .wrapper {
    padding-top: 10vh;
  }

  form {
    width: 70%;
  }
}

@media screen and (min-width: 900px) {
  form {
    width: 60%;
  }
}
</style>
