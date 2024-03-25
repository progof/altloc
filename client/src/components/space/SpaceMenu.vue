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
import NoteIcon from "@/assets/icons/NoteIcon.svg?component";
import EventIcon from "@/assets/icons/EventIcon.svg?component";
import FollowIcon from "@/assets/icons/FollowIcon.svg?component";

const route = useRoute();
const spaceId: string = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

console.log("space_id", spaceId);
const { data: space } = useQuery(getSpaceQueryOptions(spaceId));

const { mutate: following } = useFollowToSpaceMutation();
const { mutate: unfollowing } = useUnFollowToSpaceMutation();

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
        console.log("unfollow space");
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
  <div class="space__menu">
    <MyButton
      class="menu__item"
      @click="$router.push(`/spaces/members/${space?.space_id}`)"
    >
      <MemberIcon class="icons" />
      Members
    </MyButton>
    <div class="menu__item"><EventIcon class="icons" />Events</div>
    <MyButton
      class="menu__item"
      @click="$router.push(`/spaces/notes/${space?.space_id}`)"
    >
      <NoteIcon class="icons" />
      Notes
    </MyButton>
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
</template>

<style scoped>
.icons {
  width: 24px;
  height: 24px;
  margin-right: 10px;
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
