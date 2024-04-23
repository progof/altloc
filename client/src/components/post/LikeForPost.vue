<!-- <script setup lang="ts">
import { ref, computed } from "vue";
import LikeIcon from "@/assets/icons/LikeIcon.svg?component";

import { useLikePostMutation } from "@/services/post.service";

const { mutate: likePost, isPending, error } = useLikePostMutation();
interface Post {
  id: number;
  likes: number;
}

const post: Post = {
  id: 1,
  likes: 0,
};

const likes = ref(post.likes);
const likedPosts = ref<number[]>([]);

const isLiked = computed(() => likedPosts.value.includes(post.id));

const incrementLikes = () => {
  if (!isLiked.value) {
    likes.value++;
    likedPosts.value.push(post.id);
    console.log("like", likes);
  }
};
</script>

<template>
  <div
    style="display: flex; flex-direction: row; justify-content: space-between"
  >
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
</style> -->

<script setup lang="ts">
import { ref, computed, defineProps } from "vue";
import LikeIcon from "@/assets/icons/LikeIcon.svg?component";
import { useLikePostMutation } from "@/services/post.service";

const { mutate: likePost, isPending, error } = useLikePostMutation();

const props = defineProps({
  postId: String,
});

console.log("get postId:", props.postId);

interface Post {
  id: string; // Поменяйте на string, если идентификатор поста строковый
  likes: number;
}

const post: Post = {
  id: "2",
  likes: 0,
};

const likes = ref(post.likes);
const likedPosts = ref<string[]>([]); // Поменяйте тип идентификатора поста на string, если он строковый

const isLiked = computed(() => likedPosts.value.includes(post.id));

const incrementLikes = () => {
  if (!isLiked.value) {
    likes.value++;
    likedPosts.value.push(post.id);
    likePost({ postId: props.postId, likes: likes.value }); // Отправляем запрос на сервер при нажатии на кнопку лайка
  }
};
</script>

<template>
  <div
    style="display: flex; flex-direction: row; justify-content: space-between"
  >
    <button @click="incrementLikes" :disabled="isLiked" class="button">
      <LikeIcon style="width: 24px; height: 24px" />
      <div style="font-size: 10px">{{ likes }}</div>
    </button>
  </div>
</template>

<style scoped>
.button {
  background-color: rgba(0, 0, 0, 0); /* Прозрачный фон кнопки */
  border: none; /* Удаление границы */
  cursor: pointer; /* Показать, что кнопка кликабельна */
}

/* Стили для счетчика лайков */
div {
  display: inline-block;
  margin-left: 5px; /* Добавляем отступ между иконкой и счетчиком */
}
</style>
