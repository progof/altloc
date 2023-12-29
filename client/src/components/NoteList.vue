  <script setup lang="ts">
import { reactive } from 'vue';
  import { useQuery } from '@tanstack/vue-query';
  import { getNoteQueryOptions, useNoteDeleteMutation } from '@/services/app.service';
//   import MarkdownIt from 'markdown-it';
//   import * as marked from 'marked';

  const { data: notes } = useQuery(getNoteQueryOptions);
  const notesData = reactive({ notes: [] }); 
  const { mutate: noteDelete, isPending: isDeleting, error: deleteError } = useNoteDeleteMutation();

//   const md = new MarkdownIt();

// const convertToHtml = (markdown: string) => {
//   return md.render(markdown);
// };

const formatCreatedAt = (createdAt : string) => {
  const date = new Date(createdAt);
  return date.toLocaleString(); // Или другой формат вывода по вашему выбору
};



function htmlToFormattedText2(html:string) {
  let tempElement = document.createElement('div');
  tempElement.innerHTML = html;

  return tempElement.innerHTML;
}



  const handleDeleteNote = async (noteId: string) => {
    try {
      await noteDelete({
        note_id: noteId,
      });
  
    //   if (notes.value) {
    //     const index = notes.value.findIndex((note) => note.note_id === noteId);
    //     if (index !== -1) {
    //       notes.value.splice(index, 1);
    //     }
    //   }
    if (notes.value) {
      const filteredNotes = notes.value.filter((note) => note.note_id !== noteId);
      notes.value = reactive([...filteredNotes]);
    }
  
      alert('Note deleted successfully!');
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };
  </script>


<template>
    <div class="note-lists" v-if="notesData.notes.length > 0"></div>
    <div class="note-lists" v-if="notes">
      <h2>My Notes</h2>
      <ul v-if="notes.length > 0">
        <li v-for="note in notes" :key="note.note_id">
          <h3>Title: {{ note.note_title }}</h3>
          <p>Description: {{ note.note_description }}</p>
          <p>Body: <span v-html="htmlToFormattedText2(note.note_body)"></span></p>
          <p>Category: {{ note.note_category }}</p>
          <p>Created at: {{ formatCreatedAt(note.created_at) }}</p>
          <p>Author: {{ note.user_id }}</p>
          <p>Note ID: {{ note.note_id }}</p>
          <span v-if="deleteError">{{ deleteError }}</span>
          <my-button @click="$router.push(`/notes/${note.note_id}`)">Open</my-button>
          <button class="open-button" @click="$router.push(`/notes/${note.note_id}`)">Open</button>
          <button class="delete-button" @click="() => handleDeleteNote(note?.note_id)">
            {{ isDeleting ? "Fetching..." : " Delete" }}
          </button>
        </li>
      </ul>
    </div>
    <div v-else>
        <p class="no-notes-message">No notes available.</p>
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
    color: #666; /* Цвет текста */
    font-size: 18px; /* Размер шрифта */
    text-align: center; /* Выравнивание текста по центру */
    margin-top: 20px; /* Отступ сверху */
  }
</style>