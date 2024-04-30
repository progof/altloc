<template>
  <transition name="modal-animation">
    <div v-show="modalActive" class="modal">
      <transition name="modal-animation-inner">
        <div v-show="modalActive" class="modal-inner">
          <i @click="close" class="far fa-times-circle"></i>
          <!-- Modal Content -->
          <slot />
          <button @click="close" type="button">Close</button>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps(["modalActive"]);
const emit = defineEmits();

const close = () => {
  emit("close");
};
</script>

<style lang="scss" scoped>
.modal-animation-enter-active,
.modal-animation-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-animation-enter-from,
.modal-animation-leave-to {
  opacity: 0;
}

.modal-animation-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-animation-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-animation-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.modal-animation-inner-leave-to {
  transform: scale(0.8);
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  // background-color: rgba(255, 255, 255, 0.7);
  background-color: rgba(15, 14, 14, 0.7);
}

.modal-inner {
  position: relative;
  max-width: 640px;
  width: 80%;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  // background-color: #fff;
  background-color: rgba(32, 32, 32, 0.9);
  border-color: rgb(55, 146, 225);
  padding: 64px 16px;
}

.modal-inner i {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 16px; /* Уменьшаем размер кнопки закрытия */
  cursor: pointer;
}

.modal-inner i:hover {
  color: crimson;
}

.modal-inner button {
  padding: 10px 15px; /* Уменьшаем размер кнопки Close */
  border: none;
  font-size: 14px; /* Уменьшаем размер текста кнопки Close */
  background-color: crimson;
  color: #fff;
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
}
</style>
