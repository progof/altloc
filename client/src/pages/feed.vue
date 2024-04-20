<script setup lang="ts">
import { ref } from "vue";
import { MyButton } from "@/components/UI";
import SearchBar from "@/components/SearchBar.vue";
import SideBarNav from "@/components/SideBarNav.vue";
import ViewAllPosts from "@/components/post/ViewAllPosts.vue";
import ViewAllNotes from "@/components/note/ViewAllNotes.vue";

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
      <div class="feed-nav">
        <MyButton
          @click="showContent('post-view')"
          :class="{ active: activeButton === 'post-view' }"
          class="feed-nav-"
        >
          Posts view
        </MyButton>
        <RouterLink to="/posts/add" class="sidebar__item">
          <AddNoteIcon class="icons" />
          Add post
        </RouterLink>
        <MyButton
          @click="showContent('note-view')"
          :class="{ active: activeButton === 'note-view' }"
        >
          Note view
        </MyButton>
      </div>
      <div v-if="activeButton === 'post-view'" class="post-view">
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
  padding: 40px;
  background-color: rgba(15, 14, 14, 0.9);
  color: azure;
  height: 100vh;
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
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.wrapper {
  max-width: 1060px;
  margin: 0 auto;
}
</style>
