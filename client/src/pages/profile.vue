<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { getUserQueryOptions } from "@/services/auth.service";
import {
  getCountNotesQueryOptions,
  getNotesForUserQueryOptions,
} from "@/services/app.service";
import { getCountPostsQueryOptions } from "@/services/post.service";

import SideBarNav from "@/components/SideBarNav.vue";
import { MyButton } from "@/components/UI";
import UserProfile from "../assets/icons/UserProfile.svg?component";

const route = useRoute();
const userId: string = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

const { data: user } = useQuery(getUserQueryOptions(userId));
const { data: countNotes } = useQuery(getCountNotesQueryOptions(userId));
const { data: countPosts } = useQuery(getCountPostsQueryOptions(userId));
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
        <div class="profile__face">
          <UserProfile class="user_icon" />
          <h2 style="color: aliceblue">Nickname: {{ user?.username }}</h2>
        </div>
        <div class="profile__info">
          <span>Nickname: {{ user?.username }}</span>
          <span style="border-color: #3e3d3d"
            >Your Email: {{ user?.email }}</span
          >
          <span
            >Account status:
            {{ user?.is_verified ? "🏅 verified " : "🚫 not verified" }}</span
          >

          <span>Count posts: {{ countPosts }}</span>
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
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
  background-color: rgba(32, 32, 32, 0.9);
  border-radius: 20px;
  height: 64px;
  padding: 20px;
}

.profile__face {
  display: flex;
  /* background-color: rgb(76, 76, 76); */
  background: url(../assets/dashboard_bg.jpg) left;
  align-items: center;
  border-radius: 20px;
}

.user_icon {
  width: 128px;
  height: 128px;
  margin: 20px;
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
  color: #757474;
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
