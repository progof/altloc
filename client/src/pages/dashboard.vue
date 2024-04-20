<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { getMeQueryOptions } from "@/services/auth.service";
import { getCountNotesQueryOptions } from "@/services/app.service";
import { getCountPostsQueryOptions } from "@/services/post.service";
import NoteList from "@/components/note/NoteList.vue";
import PostList from "@/components/post/PostList.vue";
import SideBarNav from "@/components/SideBarNav.vue";

import UserProfile from "@/assets/icons/UserProfile.svg?component";
// import Modal from "@/components/Modal.vue";

// const modalActive = ref(false);

// const toggleModal = () => {
//   modalActive.value = !modalActive.value;
// };

const { data: me } = useQuery(getMeQueryOptions);
const userId: string = me.value?.user_id;
const { data: countNotes } = useQuery(getCountNotesQueryOptions(userId));
const { data: countPosts } = useQuery(getCountPostsQueryOptions(userId));
console.log(typeof countNotes);
</script>

<template>
  <div class="conteiner">
    <SideBarNav />
    <div class="dashboard">
      <div class="wrapper">
        <div class="dashboard__face">
          <!-- <img src="../assets/default_avatar.png" alt="Altplace user avatar" /> -->
          <UserProfile class="profile" />
          <h2>Hi, {{ me?.username }} 👋</h2>
        </div>
        <div class="dashboard__info">
          <!-- <img src="../assets/default_avatar.png" alt="Altplace user avatar" /> -->
          <span style="border-color: #3e3d3d">Your Email: {{ me?.email }}</span>
          <span
            >Account status:
            {{ me?.is_verified ? "🏅 verified " : "🚫 not verified" }}</span
          >
          <span>Count posts: {{ countPosts }}</span>
          <span>Count notes: {{ countNotes }}</span>
        </div>
        <div v-if="me?.role == 'USER'">
          <p>hi user!(test msg)</p>
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
  min-height: 100vh; /* Change height to min-height */
}

.wrapper {
  max-width: 1024px;
  padding: 50px;
  height: 100%;
  background-color: rgba(15, 14, 14, 0.9);
  color: azure;
  margin: 0 auto;
}

.container {
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
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
  background-color: rgba(32, 32, 32, 0.9);
  border-radius: 20px;
  height: 64px;
  padding: 20px;
}

.dashboard__face {
  display: flex;
  background: url(../assets/dashboard_bg.jpg) left;
  align-items: center;
  border-radius: 20px;
}

.profile {
  width: 128px;
  height: 128px;
  margin: 20px;
}

span {
  display: flex;
  margin-bottom: 5px;
  color: azure;
}

.content-box {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

@media only screen and (max-width: 600px) {
  .wrapper {
    padding: 20px; /* Reduce padding for smaller screens */
  }

  .dashboard__info {
    flex-direction: column;
    align-items: center;
    height: auto;
  }

  .profile {
    width: 44px;
    height: 44px;
    margin: 10px;
  }

  .dashboard__face {
    background-size: cover;
    height: 150px; /* Adjust height for smaller screens */
  }

  .dashboard__face h2 {
    font-size: 1.5rem; /* Adjust font size for smaller screens */
  }

  .content-box {
    flex-direction: column;
  }
}

note-form,
note-list {
  margin-top: 20px;
}
</style>
