<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import {
  getSpaceQueryOptions,
  useFollowToSpaceMutation,
  useUnFollowToSpaceMutation,
} from "@/services/spaces.service";

import ChatIcon from "@/assets/icons/ChatIcon.svg?component";
import MemberIcon from "@/assets/icons/MemberIcon.svg?component";
import AddNoteIcon from "@/assets/icons/AddNoteIcon.svg?component";
import EventIcon from "@/assets/icons/EventIcon.svg?component";
import FollowIcon from "@/assets/icons/FollowIcon.svg?component";
import MyButton from "@/components/UI/MyButton.vue";

const route = useRoute();
const spaceId: string = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

console.log("space_id", spaceId);
const { data: space } = useQuery(getSpaceQueryOptions(spaceId));

const { mutate: following } = useFollowToSpaceMutation();
const { mutate: unfollowing } = useUnFollowToSpaceMutation();

const followToSpace = async (event: Event) => {
  // const rex = await following({ space_id: spaceId });
  // console.log("unf", rex);

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
        console.log("unfollow space");
      },
    }
  );
};

console.log("DEBUG", space.value?.title);
</script>

<template>
  <div class="space__menu">
    <MyButton
      class="menu__item"
      @click="$router.push(`/spaces/members/${space?.space_id}`)"
    >
      <MemberIcon class="icons" />
      Members
    </MyButton>
    <div
      class="menu__item"
      @click="$router.push(`/spaces/events/${space?.space_id}`)"
    >
      <EventIcon class="icons" />Events
    </div>
    <MyButton
      class="menu__item"
      @click="$router.push(`/spaces/notes/add/${space?.space_id}`)"
    >
      <AddNoteIcon class="icons" />
      Add note
    </MyButton>
    <div
      class="menu__item"
      @click="$router.push(`/spaces/chat/${space?.space_id}`)"
    >
      <ChatIcon class="icons" />Chat
    </div>
    <button class="menu__item" @click="unfollowToSpace">
      <FollowIcon class="icons" />
      Unfollow
    </button>
    <button class="menu__item" @click="followToSpace">
      <FollowIcon class="icons" />
      Follow
    </button>
  </div>
</template>

<style scoped>
.space__menu {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  background-color: rgba(32, 32, 32, 0.9);
  border-radius: 20px;
}

.menu__item {
  margin: 10px;
  display: flex;
  align-items: center;
  color: aliceblue;
  padding: 15px;
  font-size: 15px;
  text-decoration: none;
  border-radius: 12px;
  transition: background-color 0.3s;
  font-size: 13px;
  width: 120px;
  height: 40px;
  text-align: center;
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

.icons {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
</style>
@/components/ui/MyButton.vue
