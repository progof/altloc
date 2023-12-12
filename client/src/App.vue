<script>
import Navbar from "@/components/Navbar.vue"
export default {
    components: {
      Navbar
    }
}
</script>

<template>
  <navbar></navbar>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  padding: 20px;
}
</style>