<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGetNoteByIdMutation, Note } from '@/services/app.service';

const { mutate: useGetNoteById } = useGetNoteByIdMutation();

const route = useRoute();
const noteById: string = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
console.log("noteId: ", noteById);

const noteData = ref<Note | null>(null);

onMounted(async () => {
  try {
    const responseData = await useGetNoteById({ note_id: noteById });
    console.log("Response data:", responseData);

    if (responseData) {
      noteData.value = responseData[0];
      console.log("noteData", noteData.value);
    } else {
      console.error("No data received from the server.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
});
</script>

<template>
  <div>
    <h2>This is the page of the post with the ID: {{ noteData?.note_id }}</h2>
    <div v-if="noteData">
      <p>User ID: {{ noteData.user_id }}</p>
      <p>Title: {{ noteData.note_title }}</p>
      <p>Description: {{ noteData.note_description }}</p>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<style scoped>
</style>
