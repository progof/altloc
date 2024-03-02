<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { getAllSpacesQueryOptions } from "@/services/spaces.service.ts";
import SideBarNav from "@/components/SideBarNav.vue";
import AddSpaceIcon from "../assets/icons/AddNoteIcon.svg?component";

const { data: spaces } = useQuery(getAllSpacesQueryOptions);

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleString();
};
</script>

<template>
  <!-- <SideBarNav />
  <div class="conteiner">
    <div class="spaces">
      <div class="wrapper">
        <div class="item add-space">
          <RouterLink to="/spaces/add" style="color: aliceblue">
            <AddSpaceIcon class="icons" />
            Add note
          </RouterLink>
        </div>
        <div
          class="item space-lists"
          v-for="space in spaces"
          :key="space.space_id"
        >
          <h3>Title: {{ space.title }}</h3>
          <p>Category: {{ space.category }}</p>
          <p>Description: {{ space.description }}</p>
          <p>
            Author:
            <MyButton
              @click="$router.push(`/users/${space.user_id}`)"
              style="font-weight: bold; background-color: rgba(50, 51, 52, 0.5)"
            >
              {{ space.username }}
            </MyButton>
          </p>
          <p>Created at: {{ formatCreatedAt(space.created_at) }}</p>
          <MyButton @click="$router.push(`/spaces/${space.space_id}`)">
            View space
          </MyButton>
        </div>
      </div>
    </div>
  </div> -->
  <!---->
  <div class="conteiner">
    <SideBarNav />
    <div
      class="profile item space-lists"
      v-for="space in spaces"
      :key="space.space_id"
    >
      <div class="wrapper">
        <div class="profile__info">
          <img src="../assets/default_avatar.png" alt="" />
          <span>Title: {{ space.title }}</span>
          <span style="border-color: #3e3d3d"
            >Country: {{ space.country }}</span
          >
          <span>City: {{ space.city }}</span>
          <span>Description: {{ space.description }}</span>
        </div>
        <!-- <div class="profile__notes" v-if="notes">
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
        </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.spaces {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background-color: rgb(15, 14, 14);
  color: azure;
  height: 100vh;
  overflow: scroll;
}

.wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 1060px;
  margin: 0 auto;
}
/*
.conteiner {
  display: flex;
  flex-direction: row;
  width: 100vw;
  overflow-x: auto;
  height: 100vh;
} */

.add-space {
  order: 0;
  align-items: center;
  text-align: center;
}

.item {
  margin: 10px;
  padding: 20px;
  color: aliceblue;
  width: 195px;
  height: 195px;
  text-align: center;
  background: url(../assets/space_default.jpeg) no-repeat center;
  border-radius: 60px;
  border: 1px solid rgb(55, 146, 225);
}

.icons {
  width: 32px;
  height: 32px;
  margin-right: 10px;
  color: rgb(236, 236, 239);
}

/**/
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
