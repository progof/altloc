<script setup lang="ts">
import MainLayout from "@/layouts/MainLayout.vue";
import GameControllerIcon from "@/assets/icons/game-controller.svg?component";
import CommentIcon from "@/assets/icons/comment.svg?component";
import AstronautIcon from "@/assets/icons/astronaut.svg?component";
import TargetIcon from "@/assets/icons/target.svg?component";
import CategoriesIcon from "@/assets/icons/categories.svg?component";
import ClipboardListIcon from "@/assets/icons/clipboard-list.svg?component";
import RankingIcon from "@/assets/icons/ranking.svg?component";
import SpaceStarIcon from "@/assets/icons/space-star.svg?component";
</script>

<template>
  <MainLayout>
    <section class="relative mt-12 mb-12 p-3 px-6 md:px-10">
      <div class="container flex w-auto flex-col gap-1">
        <div
          class="flex items-center gap-14 md:gap-10 flex-col md:flex-row justify-around"
        >
          <div class="flex-col gap-3">
            <h1 class="relative text-3xl font-bold text-zinc-700 bottom-8">
              Switch to gamification mode.
            </h1>
            <span class="text-zinc-500">
              Gamification can help you reach your goals by turning daily tasks
              <br />into fun, engaging quests. Adding game elements to your
              routine<br />
              boosts motivation, productivity, and well-being. <br />Start
              gamifying today and level up your life!
            </span>

            <div class="mt-6 flex items-center">
              <a
                class="inline-flex items-center rounded-full border transition-colors bg-blue-500 text-white px-6 py-2 hover:bg-blue-600"
                href="/api/auth/google"
              >
                Get started
              </a>
            </div>
          </div>
          <div
            class="rounded-2xl bg-blue-500 w-[256px] h-[256px] p-3 flex flex-col items-center justify-center gpa-6"
          >
            <AstronautIcon class="size-40 stroke-[4] text-white z-10" />
            <span class="text-zinc-50 font-semibold">Alteranive Locus</span>
          </div>
        </div>
      </div>
    </section>
    <section class="relative group mt-6 p-12 px-6 md:px-10">
      <div class="container flex flex-col gap-12 items-center">
        <img
          src="/images/blue-grid.webp"
          alt="Gamification poster"
          class="absolute inset-0 size-full object-cover opacity-65 blur-sm bg-blue-200"
        />

        <div class="flex flex-col gap-6 items-center z-10">
          <h2 class="text-2xl font-semibold text-zinc-100 text-center">
            How to Gamify Your Goals
          </h2>
          <span class="text-zinc-200 text-center">
            Transform your goals into engaging quests with these simple steps.
            Complete tasks, gain experience, and unlock achievements along the
            way!
          </span>
        </div>

        <div
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2 z-10"
        >
          <div
            class="bg-white rounded-lg p-4 gap-3 flex-col flex transition transform hover:scale-105"
          >
            <div class="flex gap-3 items-center">
              <h2 class="text-zinc-900 font-semibold">Step 1: Set a Goal</h2>
              <TargetIcon class="size-5 stroke-[1.7] text-zinc-800" />
            </div>
            <span class="text-zinc-600 text-sm"
              >Define a meaningful goal, like improving fitness or learning a
              new skill.</span
            >
          </div>

          <div
            class="bg-white rounded-lg p-4 gap-3 flex-col flex transition transform hover:scale-105"
          >
            <div class="flex gap-3 items-center">
              <h2 class="text-zinc-900 font-semibold">
                Step 2: Organize by Category
              </h2>
              <CategoriesIcon class="size-5 stroke-[1.7] text-zinc-800" />
            </div>
            <span class="text-zinc-600 text-sm"
              >Break down your goal into categories (e.g., "Cardio" or "Strength
              Training").</span
            >
          </div>

          <div
            class="bg-white rounded-lg p-4 gap-3 flex-col flex transition transform hover:scale-105"
          >
            <div class="flex gap-3 items-center">
              <h2 class="text-zinc-900 font-semibold">
                Step 3: Add Specific Tasks
              </h2>
              <ClipboardListIcon class="size-5 stroke-[1.7] text-zinc-800" />
            </div>
            <span class="text-zinc-600 text-sm"
              >Create tasks for each category, assigning difficulty and
              priority.</span
            >
          </div>

          <div
            class="bg-white rounded-lg p-4 gap-3 flex-col flex transition transform hover:scale-105"
          >
            <div class="flex gap-3 items-center">
              <h2 class="text-zinc-900 font-semibold">
                Step 4: Track Progress
              </h2>
              <RankingIcon class="size-5 stroke-[1.7] text-zinc-800" />
            </div>
            <span class="text-zinc-600 text-sm"
              >Mark tasks as complete to earn rewards and see your
              progress.</span
            >
          </div>

          <div
            class="bg-white rounded-lg p-4 gap-3 flex-col flex transition transform hover:scale-105"
          >
            <div class="flex gap-3 items-center">
              <h2 class="text-zinc-900 font-semibold">Step 5: Reflect Daily</h2>
              <CommentIcon class="size-5 stroke-[1.7] text-zinc-800" />
            </div>
            <span class="text-zinc-600 text-sm"
              >Leave a daily comment and track your mood to measure personal
              impact.</span
            >
          </div>

          <div
            class="bg-white rounded-lg p-4 gap-3 flex-col flex transition transform hover:scale-105"
          >
            <div class="flex gap-3 items-center">
              <h2 class="text-zinc-900 font-semibold">
                Step 6: Adjust & Celebrate
              </h2>
              <SpaceStarIcon class="size-5 stroke-[1.7] text-zinc-800" />
            </div>
            <span class="text-zinc-600 text-sm"
              >Revise goals as you grow and celebrate each new milestone!</span
            >
          </div>
        </div>
      </div>
    </section>

    <section class="relative mt-6 p-3 px-6 md:px-10">
      <div class="container flex w-auto flex-col gap-1">
        <div
          class="flex flex-col md:flex-row gap-12 items-center mb-6 justify-around"
        >
          <div
            class="flex flex-col gap-3 bg-blue-400/75 p-3 bg-opacity-80 rounded-xl h-auto max-w-96"
          >
            <div class="flex gap-3 items-center bg-blue-50 rounded-xl p-3">
              <h3 class="font-semibold text-zinc-900">
                DayQuest: Develop Your Skills
              </h3>

              <GameControllerIcon
                class="mr-2 size-7 stroke-[1.7] text-zinc-800"
              />
            </div>
            <span class="text-zinc-600 bg-blue-50 rounded-xl p-3 text-sm">
              Create categories for the skills you want to develop and work on
              them every day! Fill them with tasks that will help you enhance
              these skills. Each step brings you closer to your desired outcome,
              and you'll see progress with every completed task. Start your
              self-improvement journey today!
            </span>
          </div>
          <div class="flex items-center">
            <img
              src="/images/dayQuest-example.png"
              alt="DayQuest"
              class="max-w-[300px] h-auto rounded-xl drop-shadow-lg"
            />
          </div>
        </div>

        <div
          class="flex flex-col-reverse md:flex-row gap-12 items-center mb-6 justify-around"
        >
          <div class="flex">
            <img
              src="/images/dayComment-example.png"
              alt="DayQuest"
              class="max-w-[300px] h-auto rounded-xl drop-shadow-lg"
            />
          </div>
          <div
            class="flex flex-col gap-3 bg-blue-400/75 p-3 bg-opacity-80 rounded-xl h-auto max-w-96"
          >
            <div class="flex gap-3 items-center bg-blue-50 rounded-xl p-3">
              <h3 class="font-semibold text-zinc-900">
                DayComment: Record Your Thoughts
              </h3>
              <CommentIcon class="mr-2 size-7 stroke-[1.7] text-zinc-800" />
            </div>
            <span class="text-zinc-600 bg-blue-50 rounded-xl p-3 text-sm">
              Record how your day went and assess your emotional state. All
              entries will be private and visible only to you. This will help
              you become aware of your feelings, capture important moments, and
              better understand yourself. Every day is a new opportunity for
              growth and self-reflection. Start documenting your thoughts and
              feelings today!
            </span>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>
