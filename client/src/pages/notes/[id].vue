<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { getNoteQueryOptions } from '@/services/app.service';


const route = useRoute();
const noteId: string = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
const { data: note } = useQuery(getNoteQueryOptions(noteId));

</script>

<template>
  <div>
    <h2>This is the page of the post with the ID: {{ note?.note_id }}</h2>
    
    <div v-if="note">
      <p>User ID: {{ note?.user_id }}</p>
      <p>Title: {{ note?.title }}</p>
      <p>Description: {{ note?.description }}</p>
      <!-- Другие свойства объекта Note... -->
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<style scoped>
</style>
