<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <label>Email:</label>
      <input v-model="email" type="email" required>
      <label>Password:</label>
      <input v-model="password" type="password" required>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    register() {
      // Добавьте логику для отправки данных на сервер и обработки ответа
    },
  },
};
</script>

<style>
/* Стили компонента Register */
</style>
