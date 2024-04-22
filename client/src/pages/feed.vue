<script setup lang="ts">
import { ref } from "vue";
// import { useQuery } from "@tanstack/vue-query";
import { MyButton } from "@/components/UI";
import SearchBar from "@/components/SearchBar.vue";
import SearchPost from "@/components/post/SearchPost.vue";
import SideBarNav from "@/components/SideBarNav.vue";
import ViewAllPosts from "@/components/post/ViewAllPosts.vue";
import ViewAllNotes from "@/components/note/ViewAllNotes.vue";
import SpaceSlider from "@/components/feed/SpaceSlider.vue";
// import { getAllSpacesQueryOptions } from "@/services/spaces.service.ts";

import AddNoteIcon from "@/assets/icons/AddNoteIcon.svg?component";

const activeButton = ref<string>("post-view");

const showContent = (content: string) => {
  activeButton.value = content;
};

// const { data: spaces } = useQuery(getAllSpacesQueryOptions);

// const itemsPerSlide = spaces.value?.length; // Количество элементов на каждом слайде

// const formatCreatedAt = (createdAt: string) => {
//   const date = new Date(createdAt);
//   return date.toLocaleString();
// };
</script>

<template>
  <SideBarNav />
  <div class="feed">
    <div class="wrapper">
      <!-- <SpaceSlider :totalSlides="3">
        <template v-slot="{ index }">
          <div v-if="index === 0">Slide 1 content</div>
          <div v-else-if="index === 1">Slide 2 content</div>
          <div v-else>Slide 3 content</div>
        </template>
      </SpaceSlider> -->
      <SpaceSlider />
      <div class="feed-nav">
        <MyButton
          @click="showContent('post-view')"
          :class="{ active: activeButton === 'post-view' }"
          class="feed-nav-"
        >
          Posts view
        </MyButton>
        <RouterLink to="/posts/add" class="sidebar__item" title="Add post">
          <AddNoteIcon class="icons" />
        </RouterLink>

        <MyButton
          @click="showContent('note-view')"
          :class="{ active: activeButton === 'note-view' }"
        >
          Note view
        </MyButton>
      </div>
      <div v-if="activeButton === 'post-view'" class="post-view">
        <SearchPost />
        <ViewAllPosts />
      </div>
      <div v-else-if="activeButton === 'note-view'" class="note-view">
        <SearchBar />
        <ViewAllNotes />
      </div>
    </div>
  </div>
</template>

<style scoped>
.feed {
  max-width: 800px;
  margin: 0 auto;
  padding: 50px;
  background-color: rgba(15, 14, 14, 0.9);
  color: azure;
  /* height: 100vh; */
  flex: 1 1 0%;
  min-height: 100vh; /* Change height to min-height */
}

.wrapper {
  max-width: 1024px;
  height: 100%;
  color: azure;
  margin: 0 auto;
}

.feed-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.sidebar__item {
  margin: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: aliceblue;
  padding: 15px;
  font-size: 15px;
  text-decoration: none;
  border-radius: 12px;
  transition: background-color 0.3s;
  width: 128px;
  height: 40px;
}

.icons {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
</style>
