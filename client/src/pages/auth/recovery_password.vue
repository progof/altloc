<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { useRecoveryPasswordMutation } from "@/services/auth.service";
import MyButton from "@/components/UI/MyButton.vue";
// import { useRouter } from "vue-router";

// const router = useRouter();

const validationSchema = z.object({
  email: z.string().email(),
});

const validationErrors = ref<{
  email?: string;
}>({});

const {
  mutate: recovery_password,
  isPending,
  error,
} = useRecoveryPasswordMutation();

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
    return;
  }
  validationErrors.value = {};

  // recovery_password(result.data);

  recovery_password(result.data);
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

      <span v-if="error">{{ error }}</span>

      <MyButton type="submit" :disabled="isPending">
        {{ isPending ? "Fetching..." : "Reset password" }}
      </MyButton>
    </form>
  </div>
</template>

<style scoped>
.wrapper {
  padding-top: 20vh;
  max-width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  max-width: 90%;
  width: 300px;
  padding: 20px;
  margin: auto;
  border: 0px solid #ccc;
  border-radius: 10px;
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
    width: 400px;
  }
}

@media screen and (min-width: 900px) {
  form {
    width: 500px;
  }
}
</style>
@/components/ui/MyButton.vue
