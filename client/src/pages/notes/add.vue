<script setup lang="ts">
import MyButton from '@/components/UI/MyButton.vue';
import NoteForm from '@/components/NoteForm.vue';

</script>

<template>
    <MyButton @click="$router.push(`/dashboard`)">Back</MyButton>
    <div class="editor">
        <note-form />
    </div>
  </template>
  
  <style scoped>
  .editor {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;
  }
  </style>
  