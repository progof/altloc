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
      router.push("/dashboard");
    },
  });
};
</script>

<template>
  <div class="wrapper">
    <form @submit.prevent="submitForm">
      <fieldset>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" />
        <span v-if="validationErrors.email">{{ validationErrors.email }}</span>
      </fieldset>

      <fieldset>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" />
        <span v-if="validationErrors.password">{{
          validationErrors.password
        }}</span>
      </fieldset>

      <span v-if="error">{{ error }}</span>
      <div class="button-wrapper">
        <MyButton type="submit" :disabled="isPending">
          {{ isPending ? "Fetching..." : "Login" }}
        </MyButton>
        <MyButton @click="$router.push(`/recovery-password`)"
          >Forgot password?</MyButton
        >
      </div>
    </form>
  </div>
</template>

<style scoped>
/* .wrapper {
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
}

button {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

input {
  background-color: rgb(0, 0, 0);
  color: aliceblue;
  border: 2px solid rgb(55, 146, 225);
  border-radius: 4px;
}

input:focus {
  background-color: rgb(0, 0, 0);
  color: aliceblue;
  border: 2px solid rgb(78, 225, 55);
  border-radius: 4px;
}

fieldset {
  border: none;
} */

/* Styles for the wrapper */
.wrapper {
  padding-top: 10vh; /* Adjusted padding for top spacing */
  max-width: 400px; /* Adjusted max-width for better responsiveness */
  margin: 0 auto;
  width: 90vw; /* Adjusted width for better responsiveness */
  height: 100vh;
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}

/* Styles for the form */
form {
  width: 100%; /* Make form full width */
  padding: 20px;
  border-radius: 15px;
  background-color: black;
}

/* Styles for labels */
label {
  display: block;
  margin-bottom: 10px; /* Increased margin for better spacing */
  color: aliceblue; /* Adjusted color for better visibility */
}

/* Styles for inputs */
input {
  width: 100%;
  padding: 12px; /* Adjusted padding for better appearance */
  margin-bottom: 20px; /* Increased margin for better spacing */
  box-sizing: border-box;
  background-color: rgb(0, 0, 0);
  color: aliceblue;
  border: 2px solid rgb(55, 146, 225);
  border-radius: 4px;
}

input:focus {
  background-color: rgb(0, 0, 0);
  color: aliceblue;
  border: 2px solid rgb(78, 225, 55);
  border-radius: 4px;
}

/* Styles for button wrapper */
.button-wrapper {
  display: flex; /* Make button wrapper a flex container */
  flex-direction: column;
  justify-content: center; /* Center align buttons horizontally */
}

/* Styles for buttons */
button {
  width: 100%; /* Make button full width */
  background-color: #4caf50;
  color: white;
  padding: 10px 15px; /* Adjusted padding for better appearance */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px; /* Increased margin for better spacing */
  font-size: 14px; /* Reduced font size for buttons */
}

/* Styles for spans */
span {
  color: red; /* Adjusted color for better visibility */
}
</style>
