<template>
    <div v-if="showModal" class="dialog" @click="closeModal">
      <div class="dialog__content" @click.stop>
        <slot></slot>
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const showModal = ref(false);
  
  const openModal = () => {
    showModal.value = true;
  };
  
  const closeModal = () => {
    showModal.value = false;
  };
  </script>
  
  <style scoped>
  .dialog {
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    display: flex;
  }
  
  .dialog__content {
    margin: auto;
    background: white;
    border-radius: 12px;
    min-height: 50px;
    min-width: 300px;
    padding: 20px;
  }
  
  .dialog__content button {
    margin-top: 10px;
  }
  </style>
  