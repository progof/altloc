<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { getSpaceQueryOptions } from "@/services/spaces.service";
import { getNotesForSpaceQueryOptions } from "@/services/app.service";
import { getMeQueryOptions } from "@/services/auth.service";

import SideBarNav from "@/components/SideBarNav.vue";
import SpaceMenu from "@/components/space/SpaceMenu.vue";
import SapceDashboard from "@/components/space/SapceDashboard.vue";
import AddNoteIcon from "@/assets/icons/AddNoteIcon.svg?component";
import MyButton from "@/components/UI/MyButton.vue";
// import SearchNote from "@/components/note/SearchNote.vue";

const { data: me } = useQuery(getMeQueryOptions);

const route = useRoute();
const spaceId: string = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

const { data: notes } = useQuery(getNotesForSpaceQueryOptions(spaceId));

console.log("space_id", spaceId);
console.log("user_id", me.value?.user_id);
const { data: space } = useQuery(getSpaceQueryOptions(spaceId));

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
        <SapceDashboard />
        <SpaceMenu />
        <div class="dashboard__notes">
          <h3>Notes:</h3>

          <MyButton
            class="menu__item"
            @click="$router.push(`/spaces/notes/add/${space?.space_id}`)"
          >
            <AddNoteIcon class="icons" />
            Add note
          </MyButton>
          <!-- <SearchNote /> -->
          <!-- <div class="profile__notes">
            <h2>All Notes</h2>
            <ul>
              <li>
                <h3>Title: {{ notes?.title }}</h3>
                <p>Category: {{ notes?.category }}</p>
                <p>Description: {{ notes?.description }}</p>
                <p>Author: {{ notes?.username }}</p>
                <p>Created at: {{ formatCreatedAt(notes?.created_at) }}</p>
                <MyButton @click="$router.push(`/notes/${notes?.note_id}`)">
                  Full note
                </MyButton>
              </li>
            </ul>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile__notes {
  height: 400px;
  overflow: scroll;
}

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
  flex-wrap: wrap;
  width: 100vw;
  height: 100vh;
}

.menu__item {
  margin: 15px;
  align-items: center;
  color: aliceblue;
  padding: 15px;
  font-size: 15px;
  text-decoration: none;
  border-radius: 12px;
  transition: background-color 0.3s;
}

.menu__item:hover {
  background-color: rgb(55, 146, 225);
  color: #12171e;
}

button {
  background-color: rgba(32, 32, 32, 0.9);
  color: aliceblue;
  border: none;
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
  color: #645d5d;
}
</style>
@/components/ui/MyButton.vue
