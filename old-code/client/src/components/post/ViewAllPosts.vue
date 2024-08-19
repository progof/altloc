<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { getAllPostsQueryOptions } from "@/services/post.service";
import { MyButton } from "@/components/UI";
import LikeForPost from "@/components/post/LikeForPost.vue";
import CommentForPost from "@/components/post/CommentForPost.vue";
import SavedPost from "@/components/post/SavedPost.vue";
import SharePost from "@/components/post/SharePost.vue";
import UserProfile from "@/assets/icons/UserProfile.svg?component";

const { data: posts } = useQuery(getAllPostsQueryOptions);

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
  <div class="note-lists" v-if="posts">
    <h2>All Posts</h2>
    <ul v-if="posts.length > 0">
      <li v-for="post in posts" :key="post.post_id">
        <div class="post-card">
          <div class="dashboard__face">
            <UserProfile style="width: 32px; height: 32px; margin: 20px" />
            <MyButton
              @click="$router.push(`/users/${post.user_id}`)"
              style="font-weight: bold; background-color: rgba(15, 14, 14, 0.1)"
            >
              {{ post.username }}
            </MyButton>
          </div>
          <span
            class="post-content"
            v-html="htmlToFormattedText2(post.content)"
          ></span>
          <span style="margin-top: 10px; font-size: 12px"
            >Created at: {{ formatCreatedAt(post.created_at) }}</span
          >
          <MyButton @click="$router.push(`/posts/${post.post_id}`)">
            Full post
          </MyButton>
          <div class="user-active">
            <LikeForPost :postId="post.post_id" :postLike="post.likes" />
            <CommentForPost :postId="post.post_id" />
            <SavedPost :postId="post.post_id" />
            <SharePost :postId="post.post_id" />
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div v-else>
    <p class="no-notes-message">No posts available.</p>
  </div>
</template>

<style scoped>
.post-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  padding: 10px;
}

.user-active {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 10px;
}

.post-content {
  padding: 10px;
}

.note-lists {
  margin-top: 10px;
  height: 700px;
  overflow: scroll;
  align-items: center;
  justify-content: center;
}

.note-lists h2 {
  color: rgb(55, 146, 225);
  font-size: 16px;
  margin-bottom: 10px;
}

.note-lists ul {
  list-style-type: none;
  padding: 0;
}

.note-lists li {
  margin-bottom: 10px;
  padding: 10px;
  /* position: relative; */
  margin-top: 20px;
}

.note-lists h3 {
  color: rgb(55, 146, 225);
  margin-bottom: 5px;
}

.note-lists p {
  margin-bottom: 5px;
  color: #959595;
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

.dashboard__face {
  display: flex;
  align-items: center;
}
</style>
