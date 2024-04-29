<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { getSpaceQueryOptions } from "@/services/spaces.service";
import { getNotesForSpaceQueryOptions } from "@/services/app.service";
import { getMeQueryOptions } from "@/services/auth.service";

import SideBarNav from "@/components/SideBarNav.vue";
import SpaceMenu from "@/components/space/SpaceMenu.vue";
import SearchBar from "@/components/SearchBar.vue";
// import { MyButton } from "@/components/UI";
// import UserProfile from "@/assets/icons/UserProfile.svg?component";

const { data: me } = useQuery(getMeQueryOptions);

const route = useRoute();
const spaceId: string = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

console.log("space_id", spaceId);
console.log("user_id", me.value?.user_id);
const { data: space } = useQuery(getSpaceQueryOptions(spaceId));

const { data: notes } = useQuery(getNotesForSpaceQueryOptions(spaceId));

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleString();
};
</script>

<template>
  <div class="conteiner">
    <SideBarNav />
    <div class="profile item space-lists">
      <div class="wrapper">
        <div class="space__face">
          <img src="@/assets/neptune2.jpeg" alt="" />
          <h2 style="color: aliceblue">Space: {{ space?.title }} 👋</h2>
        </div>
        <div class="space__info" v-if="space">
          <span style="border-color: #3e3d3d"
            >Country: {{ space?.country }}</span
          >
          <span>City: {{ space?.city }}</span>
          <span>Description: {{ space?.description }}</span>
        </div>
        <SpaceMenu />
        <div class="feed">
          <SearchBar />
          <div class="note-lists" v-if="notes">
            <h2>All Notes</h2>
            <ul v-if="notes.length > 0">
              <li v-for="note in notes" :key="note.note_id">
                <h3>Title: {{ note.title }}</h3>
                <p>Category: {{ note.category }}</p>
                <p>Description: {{ note.description }}</p>
                <p>
                  Author:
                  <router-link
                    :to="`/users/${note.user_id}`"
                    style="
                      font-weight: bold;
                      background-color: rgba(50, 51, 52, 0.5);
                    "
                  >
                    {{ note.username }}
                  </router-link>
                </p>
                <p>Created at: {{ formatCreatedAt(note.created_at) }}</p>
                <router-link :to="`/notes/${note.note_id}`"
                  >Full note</router-link
                >
              </li>
            </ul>
          </div>
          <div v-else>
            <p class="no-notes-message">No notes available.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile {
  flex: 1 1 0%;
  min-height: 100vh; /* Change height to min-height */
}

.wrapper {
  max-width: 1024px;
  padding: 50px;
  height: 100%;
  background-color: rgba(15, 14, 14, 0.9);
  color: azure;
  margin: 0 auto;
}

.container {
  display: flex;
  flex-direction: column;
  /* flex-wrap: wrap; */
  width: 100vw;
  height: 100vh;
}

.space__info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  /* background-color: rgba(32, 32, 32, 0.9); */
  background: url(@/assets/dashboard_bg.jpg) left;
  border-radius: 20px;
  margin-top: 20px;
  padding: 10px;
}

.space__face {
  display: flex;
  background: url(@/assets/dashboard_bg.jpg) left;
  align-items: center;
  border-radius: 20px;
  color: aliceblue;
}

/* .dashboard__info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
  background-color: rgba(32, 32, 32, 0.9);
  border-radius: 20px;
  height: 64px;
  padding: 20px;
} */

/* .profile__info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
  background: url(../assets/dashboard_bg.jpg) left;
  background-color: rgba(32, 32, 32, 0.9);
  border-radius: 20px;
  height: 64px;
  padding: 20px;
} */

.dashboard__face {
  display: flex;
  background: url(../assets/dashboard_bg.jpg) left;
  align-items: center;
  border-radius: 20px;
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

.feed {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  /* background-color: rgba(15, 14, 14, 0.9); */
  color: azure;
  /* height: 100vh; */
}

.note-lists {
  margin-top: 20px;
  height: 400px;
  overflow: scroll;
}

.note-lists h2 {
  color: rgb(55, 146, 225);
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
  color: rgb(55, 146, 225);
  margin-bottom: 5px;
}

.notet-lists p {
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
