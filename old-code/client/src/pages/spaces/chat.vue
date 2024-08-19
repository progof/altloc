<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { getMeQueryOptions } from "@/services/auth.service";

import SideBarNav from "@/components/SideBarNav.vue";
import SpaceMenu from "@/components/space/SpaceMenu.vue";
import SpaceDashboard from "@/components/space/SapceDashboard.vue";

const { data: me } = useQuery(getMeQueryOptions);

const route = useRoute();
const spaceId: string = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

console.log("space_id", spaceId);
console.log("user_id", me.value?.user_id);
</script>

<template>
  <div class="conteiner">
    <SideBarNav />
    <div class="profile">
      <div class="wrapper">
        <SpaceDashboard />
        <SpaceMenu />
        <div class="chat">
          <div>Chat...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile {
  flex: 1 1 0%;
  height: 100vh; /* Change height to min-height */
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
  width: 100vw;
  height: 100vh;
}

.chat {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  /* background-color: rgba(15, 14, 14, 0.9); */
  color: azure;
  /* height: 100vh; */
}
</style>
