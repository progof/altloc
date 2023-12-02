<script setup lang="ts">
import { ref } from 'vue';

async function register(event: Event) {
  try {
    const formData = new FormData(event.target as HTMLFormElement);
    const json = Object.fromEntries(formData);

    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    console.log("Registration successful");
    console.log(await res.text());
  } catch (error) {
    console.error("Registration error:", error.message);
  }
}

async function login(event: Event) {
  try {
    const formData = new FormData(event.target as HTMLFormElement);
    const json = Object.fromEntries(formData);

    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    console.log("Login successful");
    console.log(await res.text());
  } catch (error) {
    console.error("Login error:", error.message);
  }
}
</script>

<template>
  <form @submit.prevent="register">
    <label>Full name:</label>
    <input type="text" name="username" placeholder="Enter a name" required />
    <label>Email:</label>
    <input type="email" name="email" placeholder="Enter your email address" required />
    <label>Password:</label>
    <input type="password" name="password" placeholder="Create a password" required />
    <label>Confirm password:</label>
    <input type="password" name="password2" placeholder="confirm password" required />
    <button type="submit">Register</button>
  </form>

  <form @submit.prevent="login">
    <label>Email:</label>
    <input type="email" name="email" placeholder="Enter your email address" required />
    <label>Password:</label>
    <input type="password" name="password" placeholder="Create a password" required />
    <button type="submit">Login</button>
  </form>
</template>