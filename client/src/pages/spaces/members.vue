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

console.log("Received members data:", members.value?.user_id);
console.log("DEBUG", space.value?.title);
</script>

<template>
  <div class="container">
    <SideBarNav />
    <div class="profile">
      <div class="wrapper">
        <SapceDashboard />
        <SpaceMenu />
        <div class="members">
          <h3>Members:</h3>
          <div class="members-list" v-if="members && members.length > 0">
            <div
              class="member-item"
              v-for="member in members"
              :key="member.username"
            >
              <img src="@/assets/neptune2.jpeg" alt="" />
              <MyButton
                @click="$router.push(`/users/${member.user_id}`)"
                style="color: rgb(166, 141, 228)"
              >
                {{ member.username }}
              </MyButton>
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

.container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100vw;
  height: 100vh;
}

.members {
  margin: 10px 20px;
}

.members-list {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  justify-content: space-around;
}

.member-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
  padding: 10px;
  color: aliceblue;
  background-color: rgba(15, 14, 14, 0.5);
  border: 1px solid rgb(55, 146, 225);
  border-radius: 40px;
  width: 128px;
  height: 128px;
}

img {
  width: 128px;
  height: 128px;
  margin: 20px;
  border: 2px solid rgb(55, 146, 225);
  border-radius: 80px;
}
</style>
