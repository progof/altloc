<script setup lang="ts">
import { ref, computed, defineProps } from "vue";
import LikeIcon from "@/assets/icons/LikeIcon.svg?component";
import { useLikePostMutation } from "@/services/post.service";

const props = defineProps<{ postId: string; postLike: number }>();

const { mutate: likePost, error } = useLikePostMutation();
// const { data: post } = useQuery(getPostQueryOptions(props.postId));

const likes = ref(props.postLike);
console.log("likes", props.postId, likes);
const likedPosts = ref<string[]>([]);

const isLiked = computed(() => likedPosts.value.includes(props.postId));

const incrementLikes = () => {
  if (!isLiked.value) {
    likes.value++;
    likedPosts.value.push(props.postId);
    likePost({ postId: props.postId, likes: likes.value });
  }
};
</script>

<template>
  <div
    style="display: flex; flex-direction: row; justify-content: space-between"
  >
    <span v-if="error">{{ error }}</span>
    <button @click="incrementLikes" :disabled="isLiked" class="button">
      <LikeIcon style="width: 24px; height: 24px" />
      <div style="font-size: 10px">{{ likes }}</div>
    </button>
  </div>
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
