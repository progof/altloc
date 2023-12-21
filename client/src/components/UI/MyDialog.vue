<!-- <template>
    <div v-if="show" class="dialog" @click.stop="hideDialog">
      <div @click.stop class="dialog__content">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  
  const show = ref(false);
  
  const toggleDialog = () => {
    show.value = !show.value;
  };
  
  const hideDialog = () => {
    show.value = false;
  };
  
  onMounted(() => {
    console.log('dialog mounted');
  });
  </script>
  
  <style scoped>
  .dialog {
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    display: flex;
  }
  
  .dialog__content {
    margin: auto;
    background: white;
    border-radius: 12px;
    min-height: 50px;
    min-width: 300px;
    padding: 20px;
  }
  </style>
   -->

   <template>
    <div v-if="show" class="dialog" @click.stop="hideDialog">
      <div @click.stop class="dialog__content">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  
  const show = ref(false);
  
  const hideDialog = () => {
    show.value = false;
  };
  
  onMounted(() => {
    console.log('dialog mounted');
  });
  </script>
  
  <style scoped>
  .dialog {
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    display: flex;
  }
  
  .dialog__content {
    margin: auto;
    background: white;
    border-radius: 12px;
    min-height: 50px;
    min-width: 300px;
    padding: 20px;
  }
  </style>
  