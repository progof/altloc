<script setup lang="ts">
defineProps(["visible"]);
const emit = defineEmits();

const closeDialog = () => {
  emit("update:visible", false);
};
</script>

<template>
  <div v-if="visible" class="dialog-overlay" @click="closeDialog">
    <div class="dialog-container">
      <div class="dialog-content">
        <slot></slot>
      </div>
      <button @click="closeDialog" class="close-button">Close</button>
    </div>
  </div>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-container {
  background-color: rgba(15, 14, 14, 0.9);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
