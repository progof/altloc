<script setup lang="ts">
import ProfileDropdownMenu from "@/layouts/ProfileDropdownMenu.vue";
import { getMeQueryOptions } from "@/services/user.service";
import { useQuery } from "@tanstack/vue-query";
import { categoriesQuery } from "@/services/dayquest/category.service";

import DiamondIcon from "@/assets/icons/diamond.svg?component";
import StarIcon from "@/assets/icons/star.svg?component";
import { computed } from "vue";
import { Progress } from "@/components/ui/progress";
import AstronautIcon from "@/assets/icons/astronaut.svg?component";
import CategoriesIcon from "@/assets/icons/categories.svg?component";

const { data: user } = useQuery(getMeQueryOptions);

const { data: categories } = useQuery({
  ...categoriesQuery,
  enabled: true,
});

const baseLevelScore = 8;

const nextLevelScore = computed(() => {
  if (!user.value) return 0;
  return (user.value.level + 1) * baseLevelScore;
});

const progress = computed(() => {
  if (!user.value) return 0;
  const currentScore = user.value.score;
  const requiredScore = nextLevelScore.value;
  return requiredScore ? (currentScore / requiredScore) * 100 : 0;
});
</script>

<template>
  <header
    class="pointer-events-auto flex bg-blue-700 md:justify-center items-center p-3 px-6 md:px-10"
  >
    <div class="flex justify-between items-center flex-1">
      <div class="flex gap-2 items-center">
        <span class="font-semibold text-xl text-zinc-100">ALTLOC</span>
        <AstronautIcon class="size-10 stroke-[4] text-zinc-100" />
      </div>

      <ProfileDropdownMenu v-if="user" :user="user" class="md:hidden" />
    </div>
  </header>
  <div class="bg-blue-50 flex gap-3 p-3 px-6 md:px-10 items-center">
    <div class="flex flex-col gap-3 flex-1">
      <div class="flex gap-3 justify-between">
        <div
          class="flex gap-3 bg-blue-100 p-2 rounded-xl items-center"
          title="Experience"
        >
          <span class="text-zinc-700 text-xs" v-if="user">
            Exp:
            {{ user.score }}
            / {{ (user.level + 1) * baseLevelScore }}
          </span>
        </div>
        <div class="flex gap-3">
          <div
            class="flex gap-1 bg-blue-100 p-2 rounded-xl items-center"
            title="Categories"
          >
            <CategoriesIcon class="size-5 stroke-[1.7] text-zinc-700 text-sm" />
            <span class="text-zinc-700" v-if="user">
              {{ categories ? categories.length : 0 }} / 5
            </span>
          </div>
          <div
            class="flex gap-1 bg-blue-100 p-2 rounded-xl items-center"
            title="Level"
          >
            <StarIcon class="size-5 stroke-[1.7] text-zinc-700 text-sm" />
            <span class="text-zinc-700" v-if="user">
              {{ user.level }} lvl
            </span>
          </div>
          <div
            class="flex gap-1 bg-blue-100 p-2 rounded-xl items-center"
            title="Score"
          >
            <DiamondIcon class="size-6 stroke-[1.7] text-zinc-700" />
            <span class="text-zinc-700">{{ user?.currency }}</span>
          </div>
        </div>
      </div>
      <Progress v-model="progress" class="flex" />
    </div>
  </div>
  <div class="relative flex flex-1 flex-col bg-blue-50 h-screen">
    <slot />
  </div>
</template>
