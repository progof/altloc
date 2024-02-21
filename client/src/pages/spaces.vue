<script setup lang="ts">
import SideBarNav from "@/components/SideBarNav.vue";
</script>

<template>
  <SideBarNav />
  <div class="conteiner">
    <div class="spaces">
      <div class="wrapper">
        <div class="item">A</div>
        <div class="item">A</div>
        <div class="item">A</div>
        <div class="item">A</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spaces {
  display: flex;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background-color: rgb(15, 14, 14);
  color: azure;
  height: 100vh;
}

.wrapper {
  max-width: 1060px;
  margin: 0 auto;
}

.conteiner {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}
</style>
