<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { getMeQueryOptions } from "@/services/auth.service";
// import NoteForm from '@/components/NoteForm.vue';
import NoteList from "@/components/NoteList.vue";
import UserNav from "@/components/UserNav.vue";
import SideBar from "@/components/SideBar.vue";
import SideBarNav from "@/components/SideBarNav.vue";
// import Modal from "@/components/Modal.vue";

// const modalActive = ref(false);

// const toggleModal = () => {
//   modalActive.value = !modalActive.value;
// };

const { data: me } = useQuery(getMeQueryOptions);
// const { mutate: logout } = useLogoutMutation();
</script>

<template>
  <div class="conteiner">
    <!-- <SideBar class="joihoop" /> -->
    <SideBarNav />
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
  </div>
</template>

<style scoped>
.dashboard {
  flex: 1 1 0%;
  height: 100vh;
}

/* .sidebar {
  width: 200px;
  background-color: #0b020e;
  padding: 20px;
} */

.wrapper {
  max-width: 1024px;
  padding: 50px;
  height: 100%;
  background-color: rgba(15, 14, 14, 0.9);
  color: azure;
  margin: 0 auto;
}

.conteiner {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
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
