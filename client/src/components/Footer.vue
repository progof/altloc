<template>
  <footer class="footer">
    <div class="footer__content">
      <p>&copy; {{ currentYear }} AltPlace</p>
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
  background-color: rgba(15, 14, 14, 1);
  padding: 1% 0 1% 0;
  text-align: center;
  position: fixed;
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100vw;
  flex-shrink: 0;
}

.footer__content {
  color: rgb(249, 249, 249);
  align-items: center;
  padding: 10px;
}
</style>
