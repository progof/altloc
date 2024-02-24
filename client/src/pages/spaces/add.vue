<script setup lang="ts">
import SpaceForm from "@/components/SpaceForm.vue";
import SideBarNav from "@/components/SideBarNav.vue";
</script>

<template>
  <div class="conteiner"></div>
  <SideBarNav />
  <div class="editor">
    <h2>Add new note</h2>
    <SpaceForm />
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
