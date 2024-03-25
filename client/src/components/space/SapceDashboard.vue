<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { getSpaceQueryOptions } from "@/services/spaces.service";

const route = useRoute();
const spaceId: string = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

const { data: space } = useQuery(getSpaceQueryOptions(spaceId));
</script>

<template>
  <div class="profile__info">
    <img src="@/assets/neptune2.jpeg" alt="" />
    <span>Title: {{ space?.title }}</span>
    <span style="border-color: #3e3d3d">Country: {{ space?.country }}</span>
    <span>City: {{ space?.city }}</span>
    <span>Description: {{ space?.description }}</span>
  </div>
</template>

<style scoped>
.profile__info {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
</style>
