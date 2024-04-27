<script setup lang="ts">
import { reactive } from "vue";
import { useQuery } from "@tanstack/vue-query";
import {
  getSavedListToNoteQueryOptions,
  useDeleteSavedNoteMutation,
} from "@/services/app.service";

const { data: savedLists } = useQuery(getSavedListToNoteQueryOptions);

const {
  mutate: savedNoteDelete,
  isPending: isDeleting,
  error: deleteError,
} = useDeleteSavedNoteMutation();

function htmlToFormattedText2(html: string) {
  let tempElement = document.createElement("div");
  tempElement.innerHTML = html;

  return tempElement.innerHTML;
}

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleString();
};

const handleDeleteSavedPost = async (noteId: string) => {
  try {
    await savedNoteDelete({
      noteId,
    });

    //   if (notes.value) {
    //     const index = notes.value.findIndex((note) => note.note_id === noteId);
    //     if (index !== -1) {
    //       notes.value.splice(index, 1);
    //     }
    //   }
    if (savedLists.value) {
      const filteredPosts = savedLists.value.filter(
        (savedList) => savedList.post_id !== noteId
      );
      savedLists.value = reactive([...filteredPosts]);
    }
  } catch (err) {
    console.error("Error deleting post:", err);
  }
};
</script>

<template>
  <div class="post-lists" v-if="savedLists">
    <h2>Saved Notes</h2>
    <ul v-if="savedLists.length > 0">
      <li v-for="savedList in savedLists" :key="savedList.note_id">
        <h3>User: {{ savedList.username }}</h3>
        <p>
          Content of note:
          <span v-html="htmlToFormattedText2(savedList.body)"></span>
        </p>
        <p style="color: rgb(91, 92, 93)">
          Created at: {{ formatCreatedAt(savedList.created_at) }}
        </p>
        <span v-if="deleteError">{{ deleteError }}</span>
        <button
          class="delete-button"
          @click="() => handleDeleteSavedPost(savedList?.note_id)"
        >
          {{ isDeleting ? "Fetching..." : " Delete" }}
        </button>
      </li>
    </ul>
  </div>
  <div v-else>
    <p class="no-post-message">No saved notes available.</p>
  </div>
</template>

<style scoped>
.post-lists {
  margin-top: 20px;
  overflow: scroll;
  height: 600px;
}

.post-lists h2 {
  color: rgb(55, 146, 225);
  margin-bottom: 10px;
}

.post-lists ul {
  list-style-type: none;
  padding: 0;
}

.post-lists li {
  border: 2px solid rgb(55, 146, 225);
  margin-bottom: 10px;
  padding: 10px;
  position: relative;
}

.post-lists h3 {
  color: rgb(55, 146, 225);
  margin-bottom: 5px;
}

.post-lists p {
  margin-bottom: 5px;
  color: #fffcfc;
}

.delete-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #ff0000;
  color: white;
  border: none;
  padding: 5px 15px;
  margin: 10px;
  cursor: pointer;
}
.open-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #5de1ed;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 30px;
}

.no-post-message {
  color: #666;
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
}
</style>
