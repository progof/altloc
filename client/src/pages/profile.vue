<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { getUserQueryOptions } from "@/services/auth.service";
import {
  getCountNotesQueryOptions,
  getNotesForUserQueryOptions,
} from "@/services/app.service";
import SideBarNav from "@/components/SideBarNav.vue";
import { MyButton } from "@/components/UI";

const route = useRoute();
const userId: string = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;
const { data: user } = useQuery(getUserQueryOptions(userId));

const { data: countNotes } = useQuery(getCountNotesQueryOptions(userId));

const { data: notes } = useQuery(getNotesForUserQueryOptions(userId));

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleString();
};
</script>

<template>
  <div class="conteiner">
    <SideBarNav />
    <div class="profile">
      <div class="wrapper">
        <div class="profile__info">
          <img src="../assets/default_avatar.png" alt="" />
          <span>Nickname: {{ user?.username }}</span>
          <span style="border-color: #3e3d3d"
            >Your Email: {{ user?.email }}</span
          >
          <span
            >Account status:
            {{ user?.is_verified ? "🏅 verified " : "🚫 not verified" }}</span
          >
          <span>Count notes: {{ countNotes }}</span>
        </div>
        <div class="profile__notes" v-if="notes">
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
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile {
  flex: 1 1 0%;
  height: 100vh;
}

.wrapper {
  max-width: 1024px;
  padding: 50px;
  height: 100%;
  background-color: rgba(15, 14, 14, 0.9);
  color: azure;
  margin: 0 auto;
}

.conteiner {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}

.profile__info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* border: 1px solid aliceblue; */
  background-color: rgba(32, 32, 32, 0.9);
  border-radius: 60px;
  padding: 10px;
}

img {
  width: 128px;
  height: 128px;
  margin: 20px;
  border: 2px solid rgb(55, 146, 225);
  border-radius: 80px;
}

span {
  display: flex;
  flex-direction: row;
  margin: 10px;
  color: azure;
}

.profile__notes {
  margin-top: 20px;
  height: 700px;
  overflow: scroll;
}

.profile__notes h2 {
  color: rgb(55, 146, 225);
  margin-bottom: 10px;
}

.profile__notes ul {
  list-style-type: none;
  padding: 0;
}

.profile__notes li {
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 10px;
  position: relative;
}

.profile__notes h3 {
  color: rgb(55, 146, 225);
  margin-bottom: 5px;
}

.profile__notes p {
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
</style>
