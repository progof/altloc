<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { getMeQueryOptions } from "@/services/auth.service";
import { getCountNotesQueryOptions } from "@/services/app.service";
import { getCountPostsQueryOptions } from "@/services/post.service";
import UserLayout from "@/layout/UserLayout.vue";
import UserProfile from "@/assets/icons/UserProfile.svg?component";
import { InsideMenu } from "@/components/user/";

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
</script>

<template>
  <UserLayout>
    <div class="flex flex-1 gap-3 flex-col">
      <div class="flex items-center h-32 gap-32 p-4 w-full">
        <div class="flex flex-col gap-3">
          <!-- <UserProfile class="w-16 h-16" /> -->
          <img
            src="/images/avatar-placeholder.gif"
            alt="avatar"
            class="w-20 h-20 border-2 border-zinc-100 rounded-full"
          />
          <h3 class="text-zinc-100">Hi, {{ me?.username }} 👋</h3>
        </div>
        <div class="flex gap-3 items-center">
          <span class="text-zinc-100 font-medium">Followers: 0</span>
          <span class="text-zinc-100 font-medium">Following: 0</span>
          <span class="text-zinc-100 font-medium">Posts: {{ countPosts }}</span>
          <span class="text-zinc-100 font-medium">Notes: {{ countNotes }}</span>
        </div>
      </div>

      <!-- <div
          class="flex flex-col md:flex-row justify-center items-center bg-[rgba(32,32,32,0.9)] rounded-2xl h-auto p-3 gap-6 flex-1 w-1/3 md:w-full"
        >
          <span class="text-sm"
            >Status:
            {{ me?.is_verified ? "🏅 verified " : "🚫 not verified" }}</span
          >s
          <span class="text-sm">Count posts: {{ countPosts }}</span>
          <span class="text-sm">Count notes: {{ countNotes }}</span>
        </div> -->

      <div class="flex flex-col flex-1">
        <InsideMenu />
      </div>
    </div>
  </UserLayout>
</template>
