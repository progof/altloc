<script >
import { ref, computed } from 'vue';
import { z } from 'zod';

const schema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  password2: z.string().min(6),
});

export default {
  setup() {
    const form = ref({
      username: '',
      email: '',
      password: '',
      password2: '',
    });

    const errors = ref({});

    const passwordsMatchError = computed(() => {
      return form.value.password !== form.value.password2;
    });

    const submitForm = async () => {
  try {
    // Check if passwords match
    if (passwordsMatchError.value) {
      throw new Error('Passwords do not match');
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('username', form.value.username);
    formData.append('email', form.value.email);
    formData.append('password', form.value.password);
    formData.append('password2', form.value.password2);
    const json = Object.fromEntries(formData);
    // Perform the fetch request to the server
    const response = await fetch('http://localhost:3000/users/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    });
    console.log(json);
    // Handle the response from the server
    if (response.ok) {
      // Registration successful
      console.log('Registration successful');
    } else {
      // Registration failed
      console.error('Registration failed');
    }
  } catch (error) {
    // Handle validation errors
    errors.value = { ...error.errors, passwordsMatch: error.message };
  }
};

    return { form, errors, passwordsMatchError, submitForm };
  },
};
</script>



<template>
  <form @submit.prevent="submitForm">
    <div>
      <label for="username">Username:</label>
      <input v-model="form.username" type="text" id="username" />
      <span v-if="errors.username">{{ errors.username }}</span>
    </div>

    <div>
      <label for="email">Email:</label>
      <input v-model="form.email" type="email" id="email" />
      <span v-if="errors.email">{{ errors.email }}</span>
    </div>

    <div>
      <label for="password">Password:</label>
      <input v-model="form.password" type="password" id="password" />
      <span v-if="errors.password">{{ errors.password }}</span>
    </div>

    <div>
      <label for="password2">Confirm Password:</label>
      <input v-model="form.password2" type="password" id="password2" />
      <span v-if="errors.password2">{{ errors.password2 }}</span>
    </div>

    <div>
      <span v-if="passwordsMatchError">Passwords do not match</span>
    </div>

    <button type="submit" :disabled="passwordsMatchError">Register</button>
  </form>
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
</style> 