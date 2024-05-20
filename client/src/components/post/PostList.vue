<script setup lang="ts">
import { reactive } from "vue";
import { useQuery } from "@tanstack/vue-query";
import {
  getPostsQueryOptions,
  useDeletePostMutation,
} from "@/services/post.service";
import { MyButton } from "@/components/UI";
//   import MarkdownIt from 'markdown-it';
//   import * as marked from 'marked';

const { data: posts } = useQuery(getPostsQueryOptions);
const {
  mutate: postDelete,
  isPending: isDeleting,
  error: deleteError,
} = useDeletePostMutation();

function htmlToFormattedText2(html: string) {
  let tempElement = document.createElement("div");
  tempElement.innerHTML = html;

  return tempElement.innerHTML;
}
//   const md = new MarkdownIt();

// const convertToHtml = (markdown: string) => {
//   return md.render(markdown);
// };

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleString();
};

// function htmlToFormattedText2(html: string) {
// 	let tempElement = document.createElement("div");
// 	tempElement.innerHTML = html;

// 	return tempElement.innerHTML;
// }

const handleDeleteNote = async (postId: string) => {
  try {
    await postDelete({
      postId,
    });

    //   if (notes.value) {
    //     const index = notes.value.findIndex((note) => note.note_id === noteId);
    //     if (index !== -1) {
    //       notes.value.splice(index, 1);
    //     }
    //   }
    if (posts.value) {
      const filteredPosts = posts.value.filter(
        (post) => post.post_id !== postId
      );
      posts.value = reactive([...filteredPosts]);
    }
  } catch (err) {
    console.error("Error deleting post:", err);
  }
};
</script>

<template>
  <div class="post-lists" v-if="posts">
    <h2>My Posts</h2>
    <ul v-if="posts.length > 0">
      <li v-for="post in posts" :key="post.post_id">
        <h3>Title: {{ post.title }}</h3>
        <p>
          Content: <span v-html="htmlToFormattedText2(post.content)"></span>
        </p>

        <p style="color: rgb(91, 92, 93)">
          Created at: {{ formatCreatedAt(post.created_at) }}
        </p>
        <div v-if="post.edit_at">
          <p>Edit at: {{ formatCreatedAt(post.edit_at) }}</p>
        </div>
        <!-- <p>Author: {{ note.user_id }}</p>
        <p>Note ID: {{ note.note_id }}</p> -->
        <span v-if="deleteError">{{ deleteError }}</span>
        <MyButton @click="$router.push(`/posts/${post.post_id}`)">
          Full post
        </MyButton>
        <MyButton @click="$router.push(`/posts/editor/${post.post_id}`)">
          Edit
        </MyButton>
        <button
          class="delete-button"
          @click="() => handleDeleteNote(post?.post_id)"
        >
          {{ isDeleting ? "Fetching..." : " Delete" }}
        </button>
      </li>
    </ul>
  </div>
  <div v-else>
    <p class="no-post-message">No posts available.</p>
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
@/components/ui
