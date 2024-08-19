<script setup lang="ts">
import PostForm from "@/components/post/PostForm.vue";
import SideBarNav from "@/components/SideBarNav.vue";
</script>

<template>
  <div class="conteiner"></div>
  <SideBarNav />
  <div class="editor">
    <h2>Add new post</h2>
    <post-form />
  </div>
</template>

<style scoped>
.editor {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background-color: rgb(15, 14, 14);
  color: azure;
  height: 100vh;
}
</style>
