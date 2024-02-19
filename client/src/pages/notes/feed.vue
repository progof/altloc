<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { getAllNotesQueryOptions } from "@/services/app.service";
import { MyButton } from "@/components/UI";
import SearchBar from "@/components/SearchBar.vue";
import SideBarNav from "@/components/SideBarNav.vue";

const { data: notes } = useQuery(getAllNotesQueryOptions);

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleString();
};
</script>

<template>
  <SideBarNav />
  <div class="feed">
    <div class="wrapper">
      <SearchBar />
      <div class="note-lists" v-if="notes">
        <h2>All Notes</h2>
        <ul v-if="notes.length > 0">
          <li v-for="note in notes" :key="note.note_id">
            <h3>Title: {{ note.title }}</h3>
            <p>Category: {{ note.category }}</p>
            <p>Description: {{ note.description }}</p>
            <p>Author: {{ note.username }}</p>
            <p>Created at: {{ formatCreatedAt(note.created_at) }}</p>
            <MyButton @click="$router.push(`/notes/${note.note_id}`)">
              Full note
            </MyButton>
          </li>
        </ul>
      </div>
      <div v-else>
        <p class="no-notes-message">No notes available.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feed {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background-color: rgb(15, 14, 14);
  color: azure;
  height: 100vh;
}

.wrapper {
  max-width: 1060px;
  margin: 0 auto;
}
.note-lists {
  margin-top: 20px;
  height: 700px;
  overflow: scroll;
}

.note-lists h2 {
  color: teal;
  margin-bottom: 10px;
}

.note-lists ul {
  list-style-type: none;
  padding: 0;
}

.note-lists li {
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 10px;
  position: relative;
}

.note-lists h3 {
  color: teal;
  margin-bottom: 5px;
}

.note-lists p {
  margin-bottom: 5px;
  color: #333;
}

.open-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #5de1ed;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 30px;
}

.no-notes-message {
  color: #666;
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
}
</style>
