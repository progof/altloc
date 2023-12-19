<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['post']);
const { emit } = defineEmits();

const removePost = () => {
  emit('remove', props.post);
};

const openPost = () => {
  $router.push(`/posts/${props.post.id}`);
};
</script>

<template>
    <div class="post">
      <div>
        <div><strong>Post ID:</strong> {{ post.id }}</div>
        <div><strong>Name:</strong> {{ post.title }}</div>
        <div><strong>Description:</strong> {{ post.body }}</div>
      </div>
      <div class="post__btns">
        <my-button @click="removePost">Delete</my-button>
        <my-button @click="openPost">Open</my-button>
      </div>
    </div>
</template>
  
<style scoped>
  .post {
    padding: 15px;
    border: 2px solid teal;
    margin: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .post__btns {
    display: flex;
  }
  </style>
  