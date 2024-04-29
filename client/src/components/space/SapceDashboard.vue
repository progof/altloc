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
  <div class="space__face">
    <img src="@/assets/neptune2.jpeg" alt="" />
    <h2 style="color: aliceblue">Space: {{ space?.title }} 👋</h2>
  </div>
  <div class="space__info" v-if="space">
    <span style="border-color: #3e3d3d">Country: {{ space?.country }}</span>
    <span>City: {{ space?.city }}</span>
    <span>Description: {{ space?.description }}</span>
  </div>
</template>

<style scoped>
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
