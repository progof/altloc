<script setup lang="ts">
import ProfileDropdownMenu from "@/layouts/ProfileDropdownMenu.vue";
import { getMeQueryOptions } from "@/services/user.service";
import { useQuery } from "@tanstack/vue-query";

import DiamondIcon from "@/assets/icons/diamond.svg?component";
import StarIcon from "@/assets/icons/star.svg?component";
import { computed } from "vue";
import { Progress } from "@/components/ui/progress";
import AstronautIcon from "@/assets/icons/astronaut.svg?component";

const { data: user } = useQuery(getMeQueryOptions);

// const baseLevelScore = 8; // use 8 for testing but 4 for production
// const levels = new Array(200).fill(0).map((_, i) => baseLevelScore * i);

// const levelScores = levels.map((_, level) => {
//   let sum = 0;

//   for (let [index, value] of levels.entries()) {
//     if (index >= level) {
//       return sum + value;
//     }
//     sum += value;
//   }

//   return sum;
// });

// function computeLevelByScore(score: number) {
//   for (let [index, value] of levelScores.entries()) {
//     if (score <= value) {
//       return {
//         level: index,
//         value: levels[index],
//       };
//     }
//   }
// }

// console.log("levels: ", levels);
// console.log("levelScores: ", levelScores);

const baseLevelScore = 8;

// Вычисляем опыт, необходимый для следующего уровня
const nextLevelScore = computed(() => {
  if (!user.value) return 0; // Возвращаем 0, если user не загружен
  return (user.value.level + 1) * baseLevelScore;
});

// Вычисляем текущий прогресс в процентах (опыт / опыт до следующего уровня)
const progress = computed(() => {
  if (!user.value) return 0; // Возвращаем 0, если user не загружен
  const currentScore = user.value.score;
  const requiredScore = nextLevelScore.value;
  return requiredScore ? (currentScore / requiredScore) * 100 : 0; // Убедитесь, что nextLevelScore не 0
});
</script>

<template>
  <header
    class="pointer-events-auto flex bg-blue-300 md:justify-center items-center p-3 px-6 md:px-10"
  >
    <div class="flex justify-between items-center flex-1">
      <div class="flex gap-2 items-center">
        <span class="font-semibold text-xl text-zinc-700">AltLoc</span>
        <AstronautIcon class="size-10 stroke-[4] text-zinc-700" />
      </div>

      <ProfileDropdownMenu v-if="user" :user="user" class="md:hidden" />
    </div>
  </header>
  <div class="bg-blue-50 flex gap-3 p-3 px-6 md:px-10 items-center">
    <div class="flex flex-col gap-3 flex-1">
      <div class="flex gap-3 justify-between">
        <div
          class="flex gap-3 bg-blue-100 p-2 rounded-xl items-center"
          title="Exp"
        >
          <span class="text-zinc-500 text-xs" v-if="user">
            Exp:
            {{
              user.level === 1
                ? user.score
                : (user.level + 1) * baseLevelScore - user.score
            }}
            / {{ (user.level + 1) * baseLevelScore }}
          </span>
          <!-- user.level === 1 ? user.score : (user.level + 1) * 8 - user.score  -->
        </div>
        <div class="flex gap-3">
          <div
            class="flex gap-1 bg-blue-100 p-2 rounded-xl items-center"
            title="Level"
          >
            <StarIcon class="size-6 stroke-[1.7] text-zinc-700" />
            <span class="text-zinc-700" v-if="user">
              {{ user.level }} lvl
            </span>
          </div>
          <div
            class="flex gap-1 bg-blue-100 p-2 rounded-xl items-center"
            title="Score"
          >
            <DiamondIcon class="size-6 stroke-[1.7] text-zinc-700" />
            <span class="text-zinc-700">{{ user?.score }}</span>
          </div>
        </div>
      </div>
      <Progress v-model="progress" class="flex" />
    </div>
  </div>
  <div class="relative flex flex-1 flex-col bg-blue-50 h-full">
    <slot />
  </div>
</template>
