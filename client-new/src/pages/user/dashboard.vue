<script setup lang="ts">
import { getMeQueryOptions } from "@/services/user.service";
import { useQuery } from "@tanstack/vue-query";
import AppLayout from "@/layouts/AppLayout.vue";
import { getCDNImageURL } from "@/utils";

const { data: me } = useQuery(getMeQueryOptions);
</script>

<template>
  <AppLayout>
    <section class="relative mt-3 px-6 md:px-10">
      <div class="container flex w-auto flex-col gap-6">
        <div class="flex gap-3 flex-col">
          <div class="flex items-center h-32 gap-32 p-4 w-full">
            <div class="flex flex-col gap-3">
              <img
                :src="
                  me?.avatarKey
                    ? getCDNImageURL(me?.avatarKey)
                    : '/images/placeholder_image.webp'
                "
                alt="User avatar"
                class="w-20 h-20 border-2 border-zinc-100 rounded-full shrink-0"
              />
              <h3 class="text-zinc-500">Hi, {{ me?.username }} 👋</h3>
            </div>
            <div class="flex gap-3 items-center flex-col md:flex-row">
              <span class="text-zinc-500 font-medium">Followers: 0</span>
              <span class="text-zinc-500 font-medium">Following: 0</span>
              <span class="text-zinc-500 font-medium">Posts: 0</span>
              <span class="text-zinc-500 font-medium">Notes: 0</span>
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

          <!-- <div class="flex flex-col flex-1">
        <InsideMenu />
      </div> -->
        </div>
      </div>
    </section>
  </AppLayout>
</template>
