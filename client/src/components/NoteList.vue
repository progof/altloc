  <script setup lang="ts">
  import { useQuery } from '@tanstack/vue-query';
  import { getNoteQueryOptions, useNoteDeleteMutation } from '@/services/app.service';
  import MarkdownIt from 'markdown-it';
  
  const { data: notes } = useQuery(getNoteQueryOptions);
  const { mutate: noteDelete, isPending: isDeleting, error: deleteError } = useNoteDeleteMutation();

const md = new MarkdownIt();
const renderMarkdown = (text: string) => {
    return md.render(text);
};


  const handleDeleteNote = async (noteId: string) => {
    try {
      await noteDelete({
        note_id: noteId,
      });
  
      if (notes.value) {
        const index = notes.value.findIndex((note) => note.note_id === noteId);
        if (index !== -1) {
          notes.value.splice(index, 1);
        }
      }
  
      alert('Note deleted successfully!');
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };
  </script>


<template>
    <div class="note-lists" v-if="notes">
      <h2>My Notes</h2>
      <ul>
        <li v-for="note in notes" :key="note.note_id">
          <h3>Title: {{ note.note_title }}</h3>
          <p>Description: {{ renderMarkdown(note.note_description) }}</p>
            <p>Body: {{ renderMarkdown(note.note_body) }}</p>
          <p>Category: {{ note.note_category }}</p>
          <p>Created at: {{ note.created_at }}</p>
          <p>Note ID: {{ note.note_id }}</p>
          <span v-if="deleteError">{{ deleteError }}</span>
          <button class="delete-button" @click="() => handleDeleteNote(note?.note_id)">
            {{ isDeleting ? "Fetching..." : " Delete" }}
          </button>
        </li>
      </ul>
    </div>
  </template>
  
  
<style scoped>
.note-lists {
  margin-top: 20px;
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

.delete-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #ff0000;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style>