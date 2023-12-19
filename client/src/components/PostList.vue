<script setup lang="ts">
import PostItem from './PostItem.vue';

const props = defineProps(['posts']);
const { emit } = defineEmits();

const removePost = (post) => {
  emit('remove', post);
};
</script>

<template>
    <div v-if="posts.length > 0">
      <h3>Post lists</h3>
      <transition-group name="post-list">
        <post-item v-for="post in posts" :post="post" :key="post.id" @remove="removePost" />
      </transition-group>
    </div>
    <h2 v-else style="color: red">The list of posts is empty!</h2>
  </template>
  
  <style scoped>
  .post-list {
    display: inline-block;
    margin-right: 10px;
  }
  
  .post-list-enter-active,
  .post-list-leave-active {
    transition: all 0.4s ease;
  }
  
  .post-list-enter-form,
  .post-list-leave-to {
    opacity: 0;
    transform: translateX(130px);
  }
  
  .post-list-move {
    transition: transform 0.4s ease;
  }
  </style>
  