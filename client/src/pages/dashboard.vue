<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { getMeQueryOptions } from "@/services/auth.service";
// import NoteForm from '@/components/NoteForm.vue';
import NoteList from "@/components/NoteList.vue";
import UserNav from "@/components/UserNav.vue";
// import Modal from "@/components/Modal.vue";

// const modalActive = ref(false);

// const toggleModal = () => {
//   modalActive.value = !modalActive.value;
// };

const { data: me } = useQuery(getMeQueryOptions);
// const { mutate: logout } = useLogoutMutation();
</script>

<template>
  <div class="dashboard">
    <div class="wrapper">
      <!-- <div v-if="me?.role == 'USER'">
      <p>hi user!</p>
    </div> -->
      <div class="dashboard__info">
        <h2>Hi, {{ me?.username }} 👋</h2>
        <span>Your Email: {{ me?.email }}</span>
        <span
          >Account status:
          {{ me?.is_verified ? "🏅 verified " : "🚫 not verified" }}</span
        >
        <span>Your Role: {{ me?.role }}</span>
        <span>Your ID: {{ me?.user_id }}</span>
      </div>
      <UserNav />

      <note-list />

      <!-- <Modal @close="toggleModal" :modalActive="modalActive">
      		<div class="dialog">
       			 <div class="dialog__content">
         			 <note-form />
       			 </div>
      		</div>
    	</Modal> -->
    </div>
  </div>
</template>

<style scoped>
.dashboard {
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

h2 {
  color: azure;
}

span {
  display: block;
  margin-bottom: 10px;
  color: azure;
}

note-form,
note-list {
  margin-top: 20px;
}

.home {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog__content {
  background: rgb(23, 23, 23);
  border-radius: 12px;
  min-height: 50px;
  min-width: 300px;
  padding: 20px;
  z-index: 9999;
}

.dialog__content button {
  margin-top: 10px;
}

.home .modal-content {
  display: flex;
  flex-direction: column;
}

.home .modal-content h1,
.home .modal-content p {
  margin-bottom: 16px;
}

.home .modal-content h1 {
  font-size: 32px;
}

.home .modal-content p {
  font-size: 18px;
}
</style>
