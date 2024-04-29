<script setup lang="ts">
import SpaceForm from "@/components/SpaceForm.vue";
import SideBarNav from "@/components/SideBarNav.vue";
</script>

<template>
  <div class="conteiner"></div>
  <SideBarNav />
  <div class="editor">
    <h2 style="color: aliceblue">Add new space</h2>
    <SpaceForm />
  </div>
</template>

<style scoped>
.editor {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background-color: rgba(15, 14, 14, 0.9);
  color: azure;
  height: 100vh;
}
</style>
