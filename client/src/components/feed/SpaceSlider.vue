<!-- <script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { getAllSpacesQueryOptions } from "@/services/spaces.service.ts";

const { data: spaces } = useQuery(getAllSpacesQueryOptions);
</script>

<template>
  <div class="spaces">
    <div class="item" v-for="space in spaces" :key="space.space_id">
      <h3>Title: {{ space.title }}</h3>
      <p>Category: {{ space.category }}</p>
      <MyButton @click="$router.push(`/spaces/${space.space_id}`)">
        View space
      </MyButton>
    </div>
  </div>
</template>

<style scoped>
.spaces {
  display: flex;
  align-items: center;
  justify-content: center;
}

.item {
  margin: 10px;
  padding: 20px;
  color: aliceblue;
  width: 125px;
  height: 75px;
  text-align: center;
  background: url(@/assets/space_default.jpeg) no-repeat center;
  border-radius: 30px;
  border: 1px solid rgb(55, 146, 225);
  font-size: 10px;
  color: rgb(55, 146, 225);
}
</style> -->

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { ref, onMounted } from "vue";
import { getAllSpacesQueryOptions } from "@/services/spaces.service.ts";

const {
  data: spaces,
  isLoading,
  isFetchingMore,
  fetchMore,
} = useQuery(getAllSpacesQueryOptions);

const containerRef = ref<HTMLElement | null>(null);

onMounted(() => {
  containerRef.value?.addEventListener("scroll", handleScroll);
});

const handleScroll = () => {
  const container = containerRef.value;
  if (!container) return;

  const { scrollLeft, clientWidth, scrollWidth } = container;
  if (scrollLeft + clientWidth >= scrollWidth) {
    fetchMore();
  }
};
</script>

<template>
  <div class="spaces" ref="containerRef">
    <div class="items">
      <div class="item" v-for="space in spaces" :key="space.space_id">
        <h3>Title: {{ space.title }}</h3>
        <p>Category: {{ space.category }}</p>
        <MyButton @click="$router.push(`/spaces/${space.space_id}`)">
          View space
        </MyButton>
      </div>
    </div>
    <div v-if="isLoading || isFetchingMore">Loading...</div>
  </div>
</template>

<style scoped>
.spaces {
  overflow-x: auto;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.items {
  display: flex;
}

.item {
  margin: 10px;
  padding: 20px;
  color: aliceblue;
  width: 125px;
  height: 75px;
  text-align: center;
  background: url(@/assets/space_default.jpeg) no-repeat center;
  border-radius: 30px;
  border: 1px solid rgb(55, 146, 225);
  font-size: 10px;
  color: rgb(55, 146, 225);
}
</style>
