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
  <SideBarNav />
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
          <MyButton @click="$router.push(`/spaces/${space.user_id}`)">
            View space
          </MyButton>
        </div>
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
</style>
