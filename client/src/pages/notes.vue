<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGetNoteByIdMutation, Note } from '@/services/app.service';


const { mutate: useGetNoteById } = useGetNoteByIdMutation();

const route = useRoute();
const noteById: string = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

const noteData = ref<Note | null>(null);

onMounted(async () => {
  try {
    const responseData = await useGetNoteById({ note_id: noteById });
    console.log("Raw Response Data:", responseData);

    if (Array.isArray(responseData) && responseData.length > 0) {
      noteData.value = responseData[0];
      console.log("noteData", noteData.value);
    } else {
      console.error("No data received from the server.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
</script>

<template>
  <div>
    <h2>This is the page of the post with the ID: {{ noteData?.note_id }}</h2>
    
    <div v-if="noteData">
      <p>User ID: {{ noteData?.user_id }}</p>
      <p>Title: {{ noteData?.note_title }}</p>
      <p>Description: {{ noteData?.note_description }}</p>
      <!-- Другие свойства объекта Note... -->
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
  <div class="home">
    <Modal @close="toggleModal" :modalActive="modalActive">
      <div class="modal-content">
        <h1>This is a Modal Header</h1>
        <p>This is a modal message</p>
      </div>
    </Modal>
    <button @click="toggleModal" type="button">Open Modal</button>
  </div>
</template>

<style lang="scss" scoped>
.home {
  background-color: rgba(0, 176, 234, 0.5);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-content {
    display: flex;
    flex-direction: column;

    h1,
    p {
      margin-bottom: 16px;
    }

    h1 {
      font-size: 32px;
    }

    p {
      font-size: 18px;
    }
  }
}
</style>
