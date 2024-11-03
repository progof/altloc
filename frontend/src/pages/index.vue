<script setup lang="ts">
import MainLayout from "@/layouts/MainLayout.vue";
// import { buttonVariant } from "@/components/ui/button/";
import GameControllerIcon from "@/assets/icons/game-controller.svg?component";
import CommentIcon from "@/assets/icons/comment.svg?component";
// import ScalesIcon from "@/assets/icons/scales.svg?component";
// import SpaceShipIcon from "@/assets/icons/space-ship.svg?component";
</script>

<template>
  <MainLayout>
    <section class="relative mt-3 p-6 md:px-10">
      <div class="container flex flex-col gap-12 items-center">
        <div class="group relative overflow-hidden rounded-3xl max-w-screen-md">
          <img
            src="/images/gamification.png"
            alt="Conference poster"
            class="aspect-video object-cover w-full h-auto"
          />
          <div
            class="absolute inset-0 z-[1] flex items-center justify-center bg-gradient-to-b from-blue-200/20 to-blue-400/90 p-6"
          >
            <h1
              class="md:text-5xl text-2xl font-bold tracking-tight text-zinc-700 items-center justify-center bg-blue-900/20 rounded-lg p-4"
            >
              Switch to gamification: <br />turn habits into exciting quests!
            </h1>
          </div>
        </div>
      </div>
    </section>

    <section class="relative mt-3 p-6 md:px-10">
      <div class="container flex flex-col gap-12 items-center">
        <div
          class="flex flex-col gap-3 bg-blue-200 p-6 bg-opacity-80 rounded-xl h-auto max-w-96"
        >
          <div class="flex gap-3 items-center">
            <h3 class="font-semibold text-lg text-zinc-900">
              Getting Started: Your Path to Success
            </h3>
            <div
              class="bg-blue-50/[.12] p-2.5 rounded-full flex ring-8 ring-blue-500/5 mb-5 items-center justify-center"
            >
              <GameControllerIcon
                class="mr-2 size-7 stroke-[1.7] text-zinc-800"
              />
            </div>
          </div>
          <div class="flex bg-blue-50"></div>
        </div>

        <div class="flex flex-col md:flex-row gap-12 items-center">
          <div
            class="flex flex-col gap-3 bg-blue-200 p-6 bg-opacity-80 rounded-xl h-auto max-w-96"
          >
            <div class="flex gap-3 items-center">
              <h3 class="font-semibold text-lg text-zinc-900">
                DayQuest: Develop Your Skills
              </h3>
              <div
                class="bg-blue-50/[.12] p-2.5 rounded-full flex ring-8 ring-blue-500/5 mb-5 items-center justify-center"
              >
                <GameControllerIcon
                  class="mr-2 size-7 stroke-[1.7] text-zinc-800"
                />
              </div>
            </div>
            <p class="text-zinc-600">
              Create categories for the skills you want to develop and work on
              them every day! Fill them with tasks that will help you enhance
              these skills. Each step brings you closer to your desired outcome,
              and you'll see progress with every completed task. Start your
              self-improvement journey today!
            </p>
          </div>
          <img
            src="/images/dayQuest-example.png"
            alt="DayQuest"
            class="max-w-[300px] h-auto rounded-xl drop-shadow-lg"
          />
        </div>

        <div class="flex flex-col-reverse md:flex-row gap-12 items-center">
          <img
            src="/images/dayComment-example.png"
            alt="DayQuest"
            class="max-w-[300px] h-auto rounded-xl drop-shadow-lg"
          />
          <div
            class="flex flex-col gap-3 bg-blue-200 p-6 bg-opacity-80 rounded-xl h-auto max-w-96"
          >
            <div class="flex gap-3 items-center">
              <h3 class="font-semibold text-lg text-zinc-900">
                DayComment: Record Your Thoughts
              </h3>
              <CommentIcon class="mr-2 size-7 stroke-[1.7] text-zinc-800" />
            </div>
            <p class="text-zinc-600">
              Record how your day went and assess your emotional state. All
              entries will be private and visible only to you. This will help
              you become aware of your feelings, capture important moments, and
              better understand yourself. Every day is a new opportunity for
              growth and self-reflection. Start documenting your thoughts and
              feelings today!
            </p>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>
