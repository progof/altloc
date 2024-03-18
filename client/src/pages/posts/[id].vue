<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { getPostQueryOptions } from "@/services/post.service";
import SideBarNav from "@/components/SideBarNav.vue";

const route = useRoute();
const postId: string = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;
const { data: post } = useQuery(getPostQueryOptions(postId));

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleString();
};

function htmlToFormattedText2(html: string) {
  let tempElement = document.createElement("div");
  tempElement.innerHTML = html;

  return tempElement.innerHTML;
}
</script>

<template>
  <SideBarNav />
  <div class="post-section">
    <div class="wrapper">
      <div v-if="post" class="post">
        <div class="note-header">
          <h3>Title: {{ post.title }}</h3>
        </div>

        <div class="post-info">
          <div class="post-content">
            <hr />
            <p>
              <strong>Content:</strong>
              <span v-html="htmlToFormattedText2(post.content)"></span>
            </p>
            <hr />
          </div>

          <div class="post-author" style="color: rgb(91, 92, 93)">
            <p><strong>Author:</strong> {{ post.username }}</p>
            <MyButton
              @click="$router.push(`/users/${post.user_id}`)"
              style="color: rgb(166, 141, 228)"
            >
              Profile(Test)
            </MyButton>
          </div>

          <div class="post-created_at" style="color: rgb(91, 92, 93)">
            <p>
              <strong>Created at:</strong>
              {{ formatCreatedAt(post.created_at) }}
            </p>
          </div>

          <div
            v-if="post.edit_at"
            class="post-edit_at"
            style="color: rgb(91, 92, 93)"
          >
            <p><strong>Edit at:</strong> {{ formatCreatedAt(post.edit_at) }}</p>
          </div>

          <div class="postID" style="color: rgb(91, 92, 93)">
            <p><strong>Post ID:</strong> {{ post.post_id }}</p>
          </div>
        </div>
      </div>

      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background-color: rgb(15, 14, 14);
  color: azure;
  height: 100vh;
}

/* .wrapper {
  max-width: 1060px;
  margin: 0 auto;
} */

h3,
p {
  color: rgb(55, 146, 225);
  padding-bottom: 10px;
}

.post-description p,
.post-content p,
.post-category p,
.post-created_at p,
.post-author p,
.postID p {
  margin-bottom: 10px;
}

.post-description,
.post-content,
.post-category,
.post-created_at,
.post-author,
.postID {
  margin-top: 20px;
}

.postID p {
  font-weight: bold;
}

/* Additional styles for MyButton component */
.post-button {
  margin-top: 20px;
}
.post-header h3 {
  color: rgb(55, 146, 225);
  margin-bottom: 15px;
}

.post-info {
  margin-top: 20px;
}

.post-info p {
  margin-bottom: 10px;
}

.post-info p strong {
  margin-right: 5px;
}
</style>
