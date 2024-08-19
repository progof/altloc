<script setup lang="ts">
import { defineProps } from "vue";
import { useAddSavedNoteMutation } from "@/services/app.service";
import SaveIcon from "@/assets/icons/SaveIcon.svg?component";

const { mutate: savedNote, error } = useAddSavedNoteMutation();

const props = defineProps<{ noteId: string }>();

const addNoteToList = () => {
  savedNote({ noteId: props.noteId });
};
</script>

<template>
  <span v-if="error">{{ error }}</span>
  <button @click="addNoteToList" class="button">
    <SaveIcon style="width: 24px; height: 24px" />
  </button>
</template>

<style scoped>
.button {
  background-color: rgba(0, 0, 0, 0);
  border: none;
  cursor: pointer;
}

div {
  display: inline-block;
  margin-left: 5px;
}
</style>
