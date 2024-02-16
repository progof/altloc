<template>
  <button class="btn">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  background-color: rgb(90, 12, 180);
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 5px;
  margin-left: 6px;
  margin: 10px;
}

.btn.primary {
  background-color: teal;
  color: white;
}

.btn.danger {
  border-color: red;
  color: red;
}
</style>
