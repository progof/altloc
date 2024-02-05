<template>
  <footer class="footer">
    <div class="footer__content">
      <p>&copy; {{ currentYear }} Xnote</p>
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
  background-color: lightgrey;
  padding: 10px;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

.footer__content {
  color: rgb(51, 101, 101);
}
</style>
