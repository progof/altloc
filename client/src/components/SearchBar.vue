<script setup lang="ts">
import { computed, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { getAllNotesQueryOptions } from "@/services/app.service";
import { MyButton } from "@/components/UI";

const { data: notes } = useQuery(getAllNotesQueryOptions);

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleString();
};

const searchValue = ref("");

const filteredList = computed(() => {
  if (!notes.value) return [];
  if (!searchValue.value) return notes.value;

  return notes.value.filter((note) =>
    note.title.toLowerCase().includes(searchValue.value.toLowerCase())
  );
});
</script>

<template>
  <div>
    <input type="text" v-model="searchValue" placeholder="Search notes..." />
    <div v-if="searchValue === ''">Niczego</div>
    <div
      v-else-if="filteredList.length > 0"
      class="item note"
      v-for="note in filteredList"
      :key="note.title"
    >
      <!-- <p>{{ note.title, note.note_id}}</p> -->
      <div class="note-lists">
        <ul>
          <li>
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
    </div>
    <div v-else-if="searchValue !== '' && notes?.length" class="item error">
      <p>No results found!</p>
    </div>
  </div>
</template>

<style scoped>
body {
  padding: 20px;
  min-height: 100vh;
  background-color: rgb(234, 242, 255);
}

input {
  display: block;
  width: 450px;
  margin: 20px auto;
  padding: 10px 45px;
  background: white url("assets/search-icon.svg") no-repeat 15px center;
  background-size: 15px 15px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.item {
  width: 450px;
  margin: 0 auto 10px auto;
  padding: 10px 20px;
  color: white;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.note {
  background-color: rgb(193, 238, 238);
  border: 1px solid #ddd;
  cursor: pointer;
  color: black;
}

.error {
  background-color: tomato;
}

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

@media only screen and (max-width: 600px) {
  input {
    width: 275px;
  }

  .item {
    width: 275px;
  }
}
</style>
