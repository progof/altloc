<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import {
  getSpaceQueryOptions,
  getSpaceMembersQueryOptions,
} from "@/services/spaces.service";
import { getMeQueryOptions } from "@/services/auth.service";

import SideBarNav from "@/components/SideBarNav.vue";
import SpaceMenu from "@/components/space/SpaceMenu.vue";
import SapceDashboard from "@/components/space/SapceDashboard.vue";

const { data: me } = useQuery(getMeQueryOptions);

const route = useRoute();
const spaceId: string = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

console.log("space_id", spaceId);
console.log("user_id", me.value?.user_id);
const { data: space } = useQuery(getSpaceQueryOptions(spaceId));
const { data: members } = useQuery(getSpaceMembersQueryOptions(spaceId));

console.log("Received members data:", members.value?.username);
console.log("DEBUG", space.value?.title);
</script>

<template>
  <div class="conteiner">
    <SideBarNav />
    <div class="profile item space-lists">
      <div class="wrapper">
        <SapceDashboard />
        <SpaceMenu />
        <div class="dashboard">
          <h3>Members:</h3>
          <div v-if="members && members.length > 0">
            <div v-for="member in members" :key="member.username">
              <p>{{ member.username }}</p>
            </div>
          </div>
          <div v-else>
            <p>No members found</p>
          </div>
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
  flex-wrap: wrap;
  width: 100vw;
  height: 100vh;
}
</style>
