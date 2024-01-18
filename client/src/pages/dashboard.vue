<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { getMeQueryOptions, useLogoutMutation } from "@/services/auth.service";
// import NoteForm from '@/components/NoteForm.vue';
import NoteList from "@/components/NoteList.vue";
import MyButton from "@/components/UI/MyButton.vue";
// import Modal from "@/components/Modal.vue";

// const modalActive = ref(false);

// const toggleModal = () => {
//   modalActive.value = !modalActive.value;
// };

const router = useRouter();

const { data: me } = useQuery(getMeQueryOptions);
const { mutate: logout } = useLogoutMutation();

const searchQuery = ref("");

const searchNotes = () => {
  // Ваша базовая логика поиска
  // Например, можно фильтровать заметки по содержанию searchQuery в названии title
  // Это пример, который можно настроить под ваши нужды
  NoteList.value.searchNotes(searchQuery.value);
};
</script>

<template>
  <div class="dashboard">
    <div v-if="me?.role == 'USER'">
      <p>hi user!</p>
    </div>
    <h1>Hi, {{ me?.username }} 👋</h1>
    <span>Your Email: {{ me?.email }}</span>
    <span
      >Account status:
      {{ me?.is_verified ? "🏅 verified " : "🚫 not verified" }}</span
    >
    <span>Your Role: {{ me?.role }}</span>
    <span>Your ID: {{ me?.user_id }}</span>
    <my-button
      @click="
        logout(undefined, {
          onSuccess: () => {
            router.push('/');
          },
        })
      "
    >
      Logout
    </my-button>
    <!-- <MyButton @click="toggleModal" type="button">Add note</MyButton> -->
    <MyButton @click="$router.push(`/notes/add`)">Add note</MyButton>
    <MyButton @click="$router.push(`/notes/feed`)">Feed</MyButton>

    <!-- Добавляем компонент поиска -->
    <!-- <search-query v-model="searchQuery" @search="searchNotes" /> -->

    <!-- Передаем searchQuery в компонент NoteList -->
    <note-list />
    <!-- <Modal @close="toggleModal" :modalActive="modalActive">
      		<div class="dialog">
       			 <div class="dialog__content">
         			 <note-form />
       			 </div>
      		</div>
    	</Modal> -->
  </div>
</template>

<style scoped>
* {
  background-color: rgb(255, 255, 255);
}
.dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial", sans-serif;
}

h1 {
  color: teal;
}

span {
  display: block;
  margin-bottom: 10px;
  color: teal;
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
  background: white;
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
