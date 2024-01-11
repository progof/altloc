<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { getNoteQueryOptions } from '@/services/app.service';
import MyButton from '@/components/UI/MyButton.vue';

const route = useRoute();
const noteId: string = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
const { data: note } = useQuery(getNoteQueryOptions(noteId));

const formatCreatedAt = (createdAt: string) => {
	const date = new Date(createdAt);
	return date.toLocaleString(); 
};

function htmlToFormattedText2(html: string) {
	let tempElement = document.createElement("div");
	tempElement.innerHTML = html;

	return tempElement.innerHTML;
}
</script>

<template>
    <MyButton @click="$router.push(`/dashboard`)">Back</MyButton>
    <div class="wrapper">
      <div v-if="note" class="note">
        <h3>Title: {{ note.title }}</h3>
        <div class="note-description">
            <p>Description: {{ note.description }}</p>
        </div>
        <div class="note-body">
            <hr />
            <p>Body: <span v-html="htmlToFormattedText2(note.body)"></span></p>
            <hr />
        </div>
        <div class="note-category">
            <p>Category: {{ note.category }}</p>
        </div>
        <div class="note-created_at">
            <p>Created at: {{ formatCreatedAt(note.created_at) }}</p>
        </div>
        <div class="note-author">
            <p>Author: {{ note.user_id }}</p>
        </div>
        <div class="noteID">
            <p>Note ID: {{ note.note_id }}</p>
        </div>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </template>
  
  <style scoped>
  .wrapper {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;
  }
  
  h3 {
    color: teal;
  }
  
  .note-description p,
  .note-body p,
  .note-category p,
  .note-created_at p,
  .note-author p,
  .noteID p {
    margin-bottom: 10px;
  }
  
  .note-description,
  .note-body,
  .note-category,
  .note-created_at,
  .note-author,
  .noteID {
    margin-top: 20px;
  }
  
  .noteID p {
    font-weight: bold;
  }
  
.note-body{
    color: gray;
}
  </style>
  