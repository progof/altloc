<script setup lang="ts">
  import { ref, defineEmits,  } from 'vue';
  
  const post = ref({
    title: '',
    body: ''
  });
  
  const { emit } = defineEmits();
  
  const createPost = () => {
    post.value.id = Date.now();
    emit('create', post.value);
    post.value = {
      title: '',
      body: ''
    };
  };
  </script>

<template>
    <form @submit.prevent>
      <h4>Create post</h4>
      <my-input v-focus v-model="post.title" class="input" type="text" placeholder="Name" />
      <my-input v-model="post.body" class="input" type="text" placeholder="Description" />
      <my-button class="btn" style="align-self: flex-end; margin-top: 15px;" @click="createPost">Create</my-button>
    </form>
  </template>
  
  <style scoped>
  form {
    display: flex;
    flex-direction: column;
  }
  </style>
  