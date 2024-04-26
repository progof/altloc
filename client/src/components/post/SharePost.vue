<script setup lang="ts">
import { defineProps, ref } from "vue";
import ShareIcon from "@/assets/icons/ShareIcon.svg?component";

const props = defineProps({
  postId: String,
});

const isLinkCopied = ref(false);

const copyPostLink = (postId: string) => {
  const postLink = `http://localhost:3000/posts/${postId}`;
  navigator.clipboard
    .writeText(postLink)
    .then(() => {
      isLinkCopied.value = true; // Set the flag to true when link is copied
      console.log("The link to the post has been successfully copied!");
      setTimeout(() => {
        isLinkCopied.value = false; // Reset the flag after a delay
      }, 3000); // Reset after 3 seconds
    })
    .catch((error) => {
      console.error("Error when copying a link to a post:", error);
    });
};

const handleClick = () => {
  copyPostLink(props.postId);
};
</script>

<template>
  <div
    style="display: flex; flex-direction: row; justify-content: space-between"
  >
    <button @click="handleClick" :disabled="isLinkCopied" class="button">
      <ShareIcon style="width: 24px; height: 24px" />
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
