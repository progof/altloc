<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { getNoteQueryOptions } from "@/services/app.service";
import SideBarNav from "@/components/SideBarNav.vue";

const route = useRoute();
const noteId: string = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;
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
  <SideBarNav />
  <div class="note-section">
    <div class="wrapper">
      <div v-if="note" class="note">
        <div class="note-header">
          <h3>{{ note.title }}</h3>
          <hr />
        </div>

        <div class="note-info">
          <div class="note-description">
            <p><strong>Description:</strong> {{ note.description }}</p>
          </div>

          <div class="note-category">
            <p><strong>Category:</strong> {{ note.category }}</p>
          </div>

          <div class="note-body">
            <hr />
            <p>
              <strong>Body:</strong>
              <span v-html="htmlToFormattedText2(note.body)"></span>
            </p>
            <hr />
          </div>

          <div class="note-author">
            <p>
              <strong>Author:</strong> {{ note.username }} / {{ note.user_id }}
            </p>
            <MyButton @click="$router.push(`/users/${note.user_id}`)">
              Profile
            </MyButton>
          </div>

          <div class="note-created_at">
            <p>
              <strong>Created at:</strong>
              {{ formatCreatedAt(note.created_at) }}
            </p>
          </div>

          <div v-if="note.edit_at" class="note-edit_at">
            <p><strong>Edit at:</strong> {{ formatCreatedAt(note.edit_at) }}</p>
          </div>

          <div class="noteID">
            <p><strong>Note ID:</strong> {{ note.note_id }}</p>
          </div>
        </div>
      </div>

      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background-color: rgb(15, 14, 14);
  color: azure;
  height: 100vh;
}

/* .wrapper {
  max-width: 1060px;
  margin: 0 auto;
} */

h3 {
  color: teal;
  padding-bottom: 10px;
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

/* Additional styles for MyButton component */
.note-button {
  margin-top: 20px;
}
.note-header h3 {
  color: teal;
  margin-bottom: 15px;
}

.note-info {
  margin-top: 20px;
}

.note-info p {
  margin-bottom: 10px;
}

.note-info p strong {
  margin-right: 5px;
}
</style>
