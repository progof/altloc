<template>
  <footer class="footer">
    <div class="footer__content">
      <p>&copy; {{ currentYear }} Alteranium</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const getCurrentYear = () => {
  return new Date().getFullYear();
};

const currentYear = getCurrentYear();
</script>

<style scoped>
.footer {
  /* background-color: lightgrey; */
  background: #0b020e;
  padding: 10px;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  flex-shrink: 0;
  padding-bottom: 24px;
}

.footer__content {
  color: rgb(249, 249, 249);
}
</style>
