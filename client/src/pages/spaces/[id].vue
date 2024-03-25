<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { getSpaceQueryOptions } from "@/services/spaces.service";
import { getMeQueryOptions } from "@/services/auth.service";

import SideBarNav from "@/components/SideBarNav.vue";
import SpaceMenu from "@/components/space/SpaceMenu.vue";

const { data: me } = useQuery(getMeQueryOptions);

const route = useRoute();
const spaceId: string = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

console.log("space_id", spaceId);
console.log("user_id", me.value?.user_id);
const { data: space } = useQuery(getSpaceQueryOptions(spaceId));

console.log("DEBUG", space.value?.title);
</script>

<template>
  <div class="conteiner">
    <SideBarNav />
    <div class="profile item space-lists">
      <div class="wrapper">
        <div class="profile__info">
          <img src="@/assets/neptune2.jpeg" alt="" />
          <span>Title: {{ space?.title }}</span>
          <span style="border-color: #3e3d3d"
            >Country: {{ space?.country }}</span
          >
          <span>City: {{ space?.city }}</span>
          <span>Description: {{ space?.description }}</span>
        </div>
        <SpaceMenu />
        <div class="space__content">content</div>
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
  flex-wrap: wrap;
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
