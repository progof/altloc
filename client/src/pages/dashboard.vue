<script setup lang="ts">
import { computed, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { getMeQueryOptions } from "@/services/auth.service";
import { getCountNotesQueryOptions } from "@/services/app.service";
import { getCountPostsQueryOptions } from "@/services/post.service";
import NoteList from "@/components/note/NoteList.vue";
import PostList from "@/components/post/PostList.vue";
import SavedPostList from "@/components/post/SavedListToPost.vue";
import SavedNoteList from "@/components/note/SavedListToNote.vue";
import SideBarNav from "@/components/SideBarNav.vue";
import { MyButton } from "@/components/UI";
import UserProfile from "@/assets/icons/UserProfile.svg?component";

// import Modal from "@/components/Modal.vue";

// const modalActive = ref(false);

// const toggleModal = () => {
//   modalActive.value = !modalActive.value;
// };

const { data: me } = useQuery(getMeQueryOptions);
// const userId = me.value?.user_id;
const { data: countNotes } = useQuery(
  computed(() => {
    if (me.value) {
      return getCountNotesQueryOptions(me.value.user_id);
    }

    return { ...getCountNotesQueryOptions(""), enabled: false };
  })
);
const { data: countPosts } = useQuery(
  computed(() => {
    if (me.value) {
      return getCountPostsQueryOptions(me.value.user_id);
    }

    return { ...getCountPostsQueryOptions(""), enabled: false };
  })
);

const activeButton = ref<string>("post-view");

const showContent = (content: string) => {
  activeButton.value = content;
};
</script>

<template>
  <div class="conteiner">
    <SideBarNav />
    <div class="dashboard">
      <div class="wrapper">
        <div class="dashboard__face">
          <UserProfile class="profile" />
          <h2>Hi, {{ me?.username }} 👋</h2>
        </div>
        <div class="dashboard__info">
          <span style="border-color: #3e3d3d">Your Email: {{ me?.email }}</span>
          <span
            >Account status:
            {{ me?.is_verified ? "🏅 verified " : "🚫 not verified" }}</span
          >
          <span>Count posts: {{ countPosts }}</span>
          <span>Count notes: {{ countNotes }}</span>
        </div>
        <!-- <div v-if="me?.role == 'USER'">
          <p>hi user!(test msg)</p>
        </div> -->
        <div class="feed-nav">
          <MyButton
            @click="showContent('post-view')"
            :class="{ active: activeButton === 'post-view' }"
            class="feed-nav-"
          >
            Posts view
          </MyButton>
          <RouterLink to="/posts/add" class="sidebar__item" title="Add post">
            <AddNoteIcon class="icons" />
          </RouterLink>

          <MyButton
            @click="showContent('note-view')"
            :class="{ active: activeButton === 'note-view' }"
          >
            Note view
          </MyButton>
          <MyButton
            @click="showContent('saved-post')"
            :class="{ active: activeButton === 'saved-post' }"
          >
            Saved posts
          </MyButton>
          <MyButton
            @click="showContent('saved-note')"
            :class="{ active: activeButton === 'saved-note' }"
          >
            Saved notes
          </MyButton>
        </div>
        <div v-if="activeButton === 'post-view'" class="post-view">
          <post-list style="overflow: scroll" />
        </div>
        <div v-if="activeButton === 'note-view'" class="note-view">
          <note-list style="overflow: scroll" />
        </div>
        <div v-if="activeButton === 'saved-post'" class="saved-post">
          <SavedPostList style="overflow: scroll" />
        </div>
        <div v-if="activeButton === 'saved-note'" class="saved-note">
          <SavedNoteList style="overflow: scroll" />
        </div>
        <!-- <div class="content-box">
          <post-list style="overflow: scroll" />
          <note-list style="overflow: scroll" />
        </div> -->

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

.feed-nav {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
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
@/components/ui
