<script setup lang="ts">
import { getMeQueryOptions } from "@/services/user.service";
import { useQuery } from "@tanstack/vue-query";
import { categoriesQuery } from "@/services/dayquest/category.service";

import DiamondIcon from "@/assets/icons/diamond.svg?component";
import StarIcon from "@/assets/icons/star.svg?component";
import { Progress } from "@/components/ui/progress";
import { computed } from "vue";

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
          title="Level"
        >
          <StarIcon class="size-5 stroke-[1.7] text-zinc-700 text-sm" />
          <span class="text-zinc-700" v-if="user"> {{ user.level }} lvl </span>
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
</template>
