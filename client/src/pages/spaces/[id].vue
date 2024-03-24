<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { ref } from "vue";
import {
  getSpaceQueryOptions,
  useFollowToSpaceMutation,
  useUnFollowToSpaceMutation,
} from "@/services/spaces.service";
import { getMeQueryOptions } from "@/services/auth.service";
import SideBarNav from "@/components/SideBarNav.vue";

import ChatIcon from "@/assets/icons/ChatIcon.svg?component";
import MemberIcon from "@/assets/icons/MemberIcon.svg?component";
import NoteIcon from "@/assets/icons/NoteIcon.svg?component";
import EventIcon from "@/assets/icons/EventIcon.svg?component";
import FollowIcon from "@/assets/icons/FollowIcon.svg?component";

const { data: me } = useQuery(getMeQueryOptions);
const userId: string = me.value?.user_id || "";

const route = useRoute();
const spaceId: string = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

console.log("space_id", spaceId);
console.log("user_id", me.value?.user_id);
const { data: space } = useQuery(getSpaceQueryOptions(spaceId));

const { mutate: following } = useFollowToSpaceMutation();
const { mutate: unfollowing } = useUnFollowToSpaceMutation();

// const isFollowing = ref(false); // Default state

const followToSpace = async (event: Event) => {
  const rex = await following({ space_id: spaceId });
  console.log("unf", rex);

  following(
    { space_id: spaceId },
    {
      onError: (err) => {
        console.error("Error following to space:", err);
      },
    }
  );
};

const unfollowToSpace = async (event: Event) => {
  unfollowing(
    { space_id: spaceId },
    {
      onError: (err) => {
        console.error("Error unfollowing to space:", err);
      },
      onSuccess: () => {
        console.log();
      },
    }
  );
};

console.log("DEBUG", space.value?.title);

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleString();
};
</script>

<template>
  <div class="conteiner">
    <SideBarNav />
    <div class="profile item space-lists">
      <div class="wrapper">
        <div class="profile__info">
          <img src="@/assets/neptune2.jpeg" alt="" />
          <span>Title: {{ space?.title }}</span>
          <span style="border-color: #3e3d3d"
            >Country: {{ space?.country }}</span
          >
          <span>City: {{ space?.city }}</span>
          <span>Description: {{ space?.description }}</span>
        </div>
        <div class="space__menu">
          <MyButton
            class="menu__item"
            @click="$router.push(`/spaces/members/${space?.space_id}`)"
          >
            <MemberIcon class="icons" />
            Members
          </MyButton>
          <div class="menu__item"><EventIcon class="icons" />Events</div>
          <div class="menu__item"><NoteIcon class="icons" />Notes</div>
          <div class="menu__item"><ChatIcon class="icons" />Chat</div>
          <button class="menu__item" @click="unfollowToSpace">
            <FollowIcon class="icons" />
            Unfollow
          </button>
          <button class="sidebar__item" @click="followToSpace">
            <FollowIcon class="icons" />
            Follow
          </button>
        </div>
        <!-- <div class="profile__notes" v-if="notes">
          <h2>All Notes</h2>
          <ul v-if="notes.length > 0">
            <li v-for="note in notes" :key="note.note_id">
              <h3>Title: {{ note.title }}</h3>
              <p>Category: {{ note.category }}</p>
              <p>Description: {{ note.description }}</p>
              <p>Author: {{ note.username }}</p>
              <p>Created at: {{ formatCreatedAt(note.created_at) }}</p>
              <MyButton @click="$router.push(`/notes/${note.note_id}`)">
                Full note
              </MyButton>
            </li>
          </ul>
        </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile {
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
  flex-wrap: wrap;
  width: 100vw;
  height: 100vh;
}

.profile__info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* border: 1px solid aliceblue; */
  background-color: rgba(32, 32, 32, 0.9);
  border-radius: 60px;
  padding: 10px;
}

.icons {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

img {
  width: 128px;
  height: 128px;
  margin: 20px;
  border: 2px solid rgb(55, 146, 225);
  border-radius: 80px;
}

span {
  display: flex;
  flex-direction: row;
  margin: 10px;
  color: azure;
}

.profile__notes {
  margin-top: 20px;
  height: 700px;
  overflow: scroll;
}

.profile__notes h2 {
  color: rgb(55, 146, 225);
  margin-bottom: 10px;
}

.profile__notes ul {
  list-style-type: none;
  padding: 0;
}

.profile__notes li {
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 10px;
  position: relative;
}

.profile__notes h3 {
  color: rgb(55, 146, 225);
  margin-bottom: 5px;
}

.profile__notes p {
  margin-bottom: 5px;
  color: #333;
}

.open-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #5de1ed;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 30px;
}

.space__menu {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: rgba(32, 32, 32, 0.9);
  border-radius: 60px;
}

.menu__item {
  margin: 15px;
  display: flex;
  align-items: center;
  color: aliceblue;
  padding: 15px;
  font-size: 15px;
  text-decoration: none;
  border-radius: 12px;
  transition: background-color 0.3s;
}

.menu__item:hover {
  background-color: rgb(55, 146, 225);
  color: #12171e;
}

button {
  background-color: rgba(32, 32, 32, 0.9);
  color: aliceblue;
  border: none;
}
</style>
