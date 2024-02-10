<script setup lang="ts">
import NoteForm from "@/components/NoteForm.vue";
import UserNav from "@/components/UserNav.vue";
</script>

<template>
  <div class="editor">
    <note-form />
    <UserNav />
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
