<!-- <script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { getAllNotesQueryOptions } from "@/services/app.service";
import { MyButton } from "@/components/UI";

const { data: notes } = useQuery(getAllNotesQueryOptions);

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleString();
};
</script>

<template>
  <div class="note-lists" v-if="notes">
    <h2>All Notes</h2>
    <ul v-if="notes.length > 0">
      <li v-for="note in notes" :key="note.note_id">
        <h3>Title: {{ note.title }}</h3>
        <p>Category: {{ note.category }}</p>
        <p>Description: {{ note.description }}</p>
        <p>
          Author:
          <MyButton
            @click="$router.push(`/users/${note.user_id}`)"
            style="font-weight: bold; background-color: rgba(50, 51, 52, 0.5)"
          >
            {{ note.username }}
          </MyButton>
        </p>
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
</template> -->

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { getAllNotesQueryOptions } from "@/services/app.service";
import { MyButton } from "@/components/UI";
import LikeForNote from "@/components/note/LikeForNote.vue";
import CommentForNote from "@/components/note/CommentForNote.vue";
import SavedNote from "@/components/note/SavedNote.vue";
import ShareNote from "@/components/note/ShareNote.vue";
import UserProfile from "@/assets/icons/UserProfile.svg?component";

const { data: notes } = useQuery(getAllNotesQueryOptions);

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
  <div class="note-lists" v-if="notes">
    <h2>All Notes</h2>
    <ul v-if="notes.length > 0">
      <li v-for="note in notes" :key="note.note_id">
        <div class="post-card">
          <div class="dashboard__face">
            <UserProfile style="width: 32px; height: 32px; margin: 20px" />
            <MyButton
              @click="$router.push(`/users/${note.user_id}`)"
              style="font-weight: bold; background-color: rgba(15, 14, 14, 0.1)"
            >
              {{ note.username }}
            </MyButton>
          </div>
          <span
            class="post-content"
            v-html="htmlToFormattedText2(note.body)"
          ></span>
          <span style="margin-top: 10px; font-size: 12px"
            >Created at: {{ formatCreatedAt(note.created_at) }}</span
          >
          <MyButton @click="$router.push(`/notes/${note.note_id}`)">
            Full post
          </MyButton>
          <div class="user-active">
            <LikeForNote :noteId="note.note_id" :noteLike="note.likes" />
            <CommentForNote :noteId="note.note_id" />
            <SavedNote :noteId="note.note_id" />
            <ShareNote :noteId="note.note_id" />
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div v-else>
    <p class="no-notes-message">No posts available.</p>
  </div>
</template>

<style scoped>
.post-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  padding: 10px;
}

.user-active {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 10px;
}

.post-content {
  padding: 10px;
}

.note-lists {
  margin-top: 10px;
  height: 700px;
  overflow: scroll;
  align-items: center;
  justify-content: center;
}

.note-lists h2 {
  color: rgb(55, 146, 225);
  font-size: 16px;
  margin-bottom: 10px;
}

.note-lists ul {
  list-style-type: none;
  padding: 0;
}

.note-lists li {
  margin-bottom: 10px;
  padding: 10px;
  /* position: relative; */
  margin-top: 20px;
}

.note-lists h3 {
  color: rgb(55, 146, 225);
  margin-bottom: 5px;
}

.note-lists p {
  margin-bottom: 5px;
  color: #959595;
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

.dashboard__face {
  display: flex;
  align-items: center;
}
</style>
