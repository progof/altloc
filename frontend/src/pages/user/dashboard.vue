<script setup lang="ts">
import { getMeQueryOptions } from "@/services/user.service";
import { useQuery } from "@tanstack/vue-query";
import AppLayout from "@/layouts/AppLayout.vue";
import { getCDNImageURL } from "@/utils";
import { AvatarRoot, AvatarImage, AvatarFallback } from "radix-vue";
import { Button } from "@/components/ui/button/";
import { ref } from "vue";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { CreateDayQuestForm } from "@/components/create-dayquest-form";
import { categoriesQuery } from "@/services/dayquest/category.service";

const { data: user } = useQuery(getMeQueryOptions);

const { data: categories } = useQuery({
  ...categoriesQuery,
  enabled: true,
});
console.log(categories);
const isOpenDayQuestDialog = ref(false);
</script>

<template>
  <AppLayout>
    <section class="relative mt-3 px-6 md:px-10">
      <div class="container flex w-auto flex-col gap-6">
        <div class="flex items-center h-32 gap-32 p-4 w-full">
          <div class="flex flex-col gap-3">
            <AvatarRoot
              class="block size-16 select-none overflow-hidden rounded-full"
            >
              <AvatarImage
                class="size-full object-cover"
                v-if="user?.avatarKey"
                :src="getCDNImageURL(user.avatarKey)"
                height="40"
                width="40"
              />
              <AvatarFallback class="block size-full">
                <img
                  height="40"
                  width="40"
                  src="/images/placeholder_image.webp"
                />
              </AvatarFallback>
            </AvatarRoot>
            <h3 class="text-zinc-500">Hi, {{ user?.username }} 👋</h3>
          </div>
          <!-- <div class="flex gap-3 items-center flex-col md:flex-row">
            <span class="text-zinc-500 font-medium text">Followers: 0</span>
            <span class="text-zinc-500 font-medium">Following: 0</span>
            <span class="text-zinc-500 font-medium">Posts: 0</span>
            <span class="text-zinc-500 font-medium">Notes: 0</span>
          </div> -->
        </div>
      </div>
    </section>
    <section class="relative mt-3 px-6 md:px-10">
      <div class="container flex w-auto flex-col gap-6">
        <div class="flex flex-col gap-3">
          <div class="flex justify-between">
            <h3 class="text-zinc-700 font-medium">DayQuests</h3>
            <Button
              size="md"
              @click="
                () => {
                  isOpenDayQuestDialog = true;
                }
              "
            >
              Create DayQuest
            </Button>
          </div>

          <div
            class="flex flex-col gap-3"
            v-for="category in categories"
            :key="category.id"
          >
            <div class="flex items-center gap-3">
              <span class="bg-indigo-400 rounded-xl size-4"></span>
              <span class="text-zinc-500 font-semibold"
                >{{ category.name }} ({{ category.tasks.length }})</span
              >
            </div>
            <ul>
              <li
                v-for="task in category.tasks"
                :key="task.id"
                class="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  :id="task.id"
                  v-model="task.isCompleted"
                />
                <label :for="task.id" class="text-sm text-zinc-500">{{
                  task.name
                }}</label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </AppLayout>
  <Dialog v-model:open="isOpenDayQuestDialog">
    <DialogContent>
      <CreateDayQuestForm @close="isOpenDayQuestDialog = false" />
      <DialogClose />
    </DialogContent>
  </Dialog>
</template>
