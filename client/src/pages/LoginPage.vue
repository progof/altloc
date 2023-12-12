<script >
import { ref, computed } from 'vue';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default {
  setup() {
    const form = ref({
      email: '',
      password: '',
    });

    const errors = ref({});


    const submitForm = async () => {
    try {

    // Create FormData object
    const formData = new FormData();
    formData.append('email', form.value.email);
    formData.append('password', form.value.password);
    const json = Object.fromEntries(formData);
    // Perform the fetch request to the server
    const response = await fetch('http://localhost:3000/users/login', {
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
      console.log('Login successful');
    } else {
      // Registration failed
      console.error('Login failed');
    }
  } catch (error) {
    // Handle validation errors
    errors.value = { ...error.errors,  };
  }
};

    return { form, errors , submitForm };
  },
};
</script>



<template>
  <form @submit.prevent="submitForm">
    
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

    <button type="submit">Login</button>
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