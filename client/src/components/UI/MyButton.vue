<template>
    <button :class="['btn', btnType]" @click="$emit('click')">
      <slot></slot>
    </button>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const btnType = ref('default'); // Возможные значения: 'default', 'primary', 'danger', и т.д.
  </script>
  
  <style scoped>
  .btn {
    background-color: teal;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 5px;
  margin-left: 6px;
  }

  .btn.primary {
    background-color: teal;
    color: white;
  }
  
  .btn.danger {
    border-color: red;
    color: red;
  }
  </style>
  