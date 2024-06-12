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
      <div class="flex flex-row md:flex-col gap-3">
        <div
          class="flex rounded-3xl items-center h-32 gap-6 p-6"
          style="background: url('../images/dashboard_bg.jpg') left"
        >
          <UserProfile class="w-16 h-16" />
          <h3 class="text-zinc-50">Hi, {{ me?.username }} 👋</h3>
        </div>
        <div
          class="flex flex-col md:flex-row justify-center items-center bg-[rgba(32,32,32,0.9)] rounded-2xl h-auto p-3 gap-6"
        >
          <span class="text-sm"
            >Status:
            {{ me?.is_verified ? "🏅 verified " : "🚫 not verified" }}</span
          >
          <span class="text-sm">Count posts: {{ countPosts }}</span>
          <span class="text-sm">Count notes: {{ countNotes }}</span>
        </div>
      </div>

      <div class="flex flex-col flex-1">
        <InsideMenu />
      </div>
    </div>
  </UserLayout>
</template>
