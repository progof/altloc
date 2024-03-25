<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { getMeQueryOptions } from "@/services/auth.service";
import { getCountNotesQueryOptions } from "@/services/app.service";
import NoteList from "@/components/note/NoteList.vue";
import PostList from "@/components/post/PostList.vue";
import SideBarNav from "@/components/SideBarNav.vue";
// import Modal from "@/components/Modal.vue";

// const modalActive = ref(false);

// const toggleModal = () => {
//   modalActive.value = !modalActive.value;
// };

const { data: me } = useQuery(getMeQueryOptions);
const userId: string = me.value?.user_id;
const { data: countNotes } = useQuery(getCountNotesQueryOptions(userId));
console.log(typeof countNotes);
</script>

<template>
  <div class="conteiner">
    <SideBarNav />
    <div class="dashboard">
      <div class="wrapper">
        <div v-if="me?.role == 'USER'">
          <p>hi user!(test msg)</p>
        </div>
        <div class="dashboard__info">
          <img src="../assets/default_avatar.png" alt="Altplace user avatar" />
          <h2>Hi, {{ me?.username }} 👋</h2>
          <span style="border-color: #3e3d3d">Your Email: {{ me?.email }}</span>
          <span
            >Account status:
            {{ me?.is_verified ? "🏅 verified " : "🚫 not verified" }}</span
          >
          <span>Count notes: {{ countNotes }}</span>
        </div>

        <div class="content-box">
          <post-list style="overflow: scroll" />
          <note-list style="overflow: scroll" />
        </div>

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

.dashboard__info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

img {
  width: 128px;
  height: 128px;
  margin: 20px;
  border: 2px solid rgb(55, 146, 225);
  border-radius: 50px;
}

span {
  display: flex;
  margin-bottom: 10px;
  color: azure;
}

.content-box {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

@media only screen and (max-width: 600px) {
  .dashboard__info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  img {
    width: 64px;
    height: 64px;
    margin: 10px;
    border: 2px solid rgb(55, 146, 225);
    border-radius: 50px;
  }
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
