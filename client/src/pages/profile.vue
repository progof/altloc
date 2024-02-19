<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { getUserQueryOptions } from "@/services/auth.service";
import SideBarNav from "@/components/SideBarNav.vue";

const route = useRoute();
const userId: string = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;
const { data: user } = useQuery(getUserQueryOptions(userId));
console.log("ID", userId);
</script>

<template>
  <div class="conteiner">
    <SideBarNav />
    <div class="profile">
      <div class="wrapper">
        <span>Nickname: {{ user?.username }}</span>
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
  width: 100vw;
  height: 100vh;
}

span {
  display: block;
  margin-bottom: 10px;
  color: azure;
}
</style>
