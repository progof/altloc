<template>
    <div>
      <input v-model="searchQuery" placeholder="Search by title or description..." />
      <button @click="searchNotes">Search</button>
  
      <div v-if="searchResults.length > 0">
        <h2>Search Results</h2>
        <ul>
          <li v-for="note in searchResults" :key="note.note_id">
            <h3>Title: {{ note.title }}</h3>
            <p>Description: {{ note.description }}</p>
            <p>Category: {{ note.category }}</p>
            <p>Created at: {{ formatCreatedAt(note.created_at) }}</p>
            <MyButton @click="$router.push(`/notes/${note.note_id}`)">
              Full note
            </MyButton>
          </li>
        </ul>
      </div>
  
      <div v-else>
        <p>No matching notes found.</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from "vue";
  import { useQuery } from "@tanstack/vue-query";
  import { getNotesQueryOptions } from "@/services/app.service";
  
  const { data: notes } = useQuery(getNotesQueryOptions);
  const searchQuery = ref("");
  const searchResults = computed(() => {
    const query = searchQuery.trim().toLowerCase();
    return notes.value.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.description.toLowerCase().includes(query)
    );
  });
  
  const searchNotes = () => {
    // You can perform additional actions here if needed
  };
  </script>
  
  <style scoped>
  h2 {
    color: teal;
    margin-bottom: 10px;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    border: 1px solid #ddd;
    margin-bottom: 10px;
    padding: 10px;
    position: relative;
  }

  h3 {
    color: teal;
    margin-bottom: 5px;
  }

  p {
    margin-bottom: 5px;
    color: #333;
  }

  button {
    background-color: teal;
    color: white;
    border: none;
    padding: 8px 15px;
    cursor: pointer;
  }

  input {
    width: 200px;
    padding: 8px;
    margin-right: 10px;
    box-sizing: border-box;
  }

  input:focus {
    outline: none;
    border: 1px solid teal;
    background-color: #f0f0f0;
  }

  p.no-notes-message {
    color: #666;
    font-size: 18px;
    text-align: center;
    margin-top: 20px;
  }
</style>
