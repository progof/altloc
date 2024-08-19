<script setup lang="ts">
import { ref } from "vue";
// import { useQuery } from "@tanstack/vue-query";
import { MyButton } from "@/components/UI";
// import Modal from "@/components/Modal.vue";
import SearchBar from "@/components/SearchBar.vue";
import SearchPost from "@/components/post/SearchPost.vue";
import SideBarNav from "@/components/SideBarNav.vue";
import ViewAllPosts from "@/components/post/ViewAllPosts.vue";
import ViewAllNotes from "@/components/note/ViewAllNotes.vue";
import SpaceSlider from "@/components/feed/SpaceSlider.vue";

import AddNoteIcon from "@/assets/icons/AddNoteIcon.svg?component";

const activeButton = ref<string>("post-view");

const showContent = (content: string) => {
  activeButton.value = content;
};
</script>

<template>
  <SideBarNav />
  <div class="feed">
    <div class="wrapper">
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
      <!-- <Modal @close="toggleModal" :modalActive="modalActive">
        <div class="dialog">
          <div class="dialog__content">test</div>
        </div>
      </Modal> -->
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
@/components/ui
