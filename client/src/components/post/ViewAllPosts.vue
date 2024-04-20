<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { getAllPostsQueryOptions } from "@/services/post.service";
import { MyButton } from "@/components/UI";
const { data: posts } = useQuery(getAllPostsQueryOptions);

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleString();
};
</script>

<template>
  <div class="note-lists" v-if="posts">
    <h2>All Posts</h2>
    <ul v-if="posts.length > 0">
      <li v-for="post in posts" :key="post.post_id">
        <h3>Title: {{ post.title }}</h3>
        <p>Description: {{ post.content }}</p>
        <!-- <p>Author: {{ note.username }}</p> -->
        <p>
          Author:
          <MyButton
            @click="$router.push(`/users/${post.user_id}`)"
            style="font-weight: bold; background-color: rgba(50, 51, 52, 0.5)"
          >
            {{ post.username }}
          </MyButton>
        </p>
        <p>Created at: {{ formatCreatedAt(post.created_at) }}</p>
        <MyButton @click="$router.push(`/posts/${post.post_id}`)">
          Full note
        </MyButton>
      </li>
    </ul>
  </div>
  <div v-else>
    <p class="no-notes-message">No posts available.</p>
  </div>
</template>

<style scoped>
.note-lists {
  margin-top: 20px;
  height: 700px;
  overflow: scroll;
}

.note-lists h2 {
  color: rgb(55, 146, 225);
  margin-bottom: 10px;
}

.note-lists ul {
  list-style-type: none;
  padding: 0;
}

.note-lists li {
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 10px;
  position: relative;
}

.note-lists h3 {
  color: rgb(55, 146, 225);
  margin-bottom: 5px;
}

.note-lists p {
  margin-bottom: 5px;
  color: #333;
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

.no-notes-message {
  color: #666;
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
}
</style>
