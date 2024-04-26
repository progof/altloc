<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { getSavedListToPostQueryOptions } from "@/services/post.service";

const { data: savedLists } = useQuery(getSavedListToPostQueryOptions);

function htmlToFormattedText2(html: string) {
  let tempElement = document.createElement("div");
  tempElement.innerHTML = html;

  return tempElement.innerHTML;
}

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleString();
};
</script>

<template>
  <div class="post-lists" v-if="savedLists">
    <h2>Saved Posts</h2>
    <ul v-if="savedLists.length > 0">
      <li v-for="savedList in savedLists" :key="savedList.post_id">
        <h3>User: {{ savedList.username }}</h3>
        <p>
          Content:
          <span v-html="htmlToFormattedText2(savedList.content)"></span>
        </p>
        <p style="color: rgb(91, 92, 93)">
          Created at: {{ formatCreatedAt(savedList.created_at) }}
        </p>
      </li>
    </ul>
  </div>
  <div v-else>
    <p class="no-post-message">No saved posts available.</p>
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
