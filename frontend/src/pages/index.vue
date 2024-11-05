<script setup lang="ts">
import MainLayout from "@/layouts/MainLayout.vue";
import GameControllerIcon from "@/assets/icons/game-controller.svg?component";
import CommentIcon from "@/assets/icons/comment.svg?component";
import AstronautIcon from "@/assets/icons/astronaut.svg?component";
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
                href="/auth/register"
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
          src="/images/abstract-space2.jpg"
          alt="Gamification poster"
          class="absolute inset-0 size-full object-cover opacity-65 blur-sm bg-blue-200"
        />
        <div class="flex flex-col gap-6 items-center z-10">
          <h2 class="text-2xl font-semibold text-zinc-100 text-center">
            How to Gamify Your Goals
          </h2>
          <span class="text-zinc-200 text-center">
            Follow these steps to gamify your goals and turn your daily tasks
            into exciting quests. With each completed task, you'll earn
            experience points, level up, and unlock new achievements. Start your
            gamification journey today!
          </span>
        </div>
        <div
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2 z-10"
        >
          <div
            class="bg-white rounded-lg p-4 gap-3 flex-col flex transition transform hover:scale-105"
          >
            <h2 class="text-zinc-900 font-semibold">
              Step 1: Define Your Goal
            </h2>
            <span class="text-zinc-600 text-sm">
              Start by setting a clear, motivating goal that you want to
              achieve. This could be anything, like improving physical fitness,
              learning a new skill, or increasing productivity.
            </span>
          </div>
          <div
            class="bg-white rounded-lg p-4 gap-3 flex-col flex transition transform hover:scale-105"
          >
            <h2 class="text-zinc-900 font-semibold">
              Step 2: Break Down Your Goal into Categories
            </h2>
            <span class="text-zinc-600 text-sm">
              Divide your main goal into smaller, manageable categories that
              will help you stay organized. For example, if your goal is
              "getting fit," create categories like "Cardio Workouts," "Strength
              Training," and "Stretching."
            </span>
          </div>
          <div
            class="bg-white rounded-lg p-4 gap-3 flex-col flex transition transform hover:scale-105"
          >
            <h2 class="text-zinc-900 font-semibold">
              Step 3: Add Tasks to Each Category
            </h2>
            <span class="text-zinc-600 text-sm">
              Now, add specific tasks to each category, assigning each a
              priority and difficulty level. This will give structure to your
              actions and help you track progress. For instance, in "Cardio
              Workouts," you might add "Run 5 km" (Difficulty: Medium, Priority:
              High).
            </span>
          </div>
          <div
            class="bg-white rounded-lg p-4 gap-3 flex-col flex transition transform hover:scale-105"
          >
            <h2 class="text-zinc-900 font-semibold">
              Step 4: Complete Tasks and Track Progress
            </h2>
            <span class="text-zinc-600 text-sm">
              As you complete tasks, mark them as done. You’ll earn virtual
              currency, level up, and see your progress bar advance, making your
              journey more rewarding and visible.
            </span>
          </div>
          <div
            class="bg-white rounded-lg p-4 gap-3 flex-col flex transition transform hover:scale-105"
          >
            <h2 class="text-zinc-900 font-semibold">
              Step 5: Leave Daily Reflections and Track Your Emotions
            </h2>
            <span class="text-zinc-600 text-sm">
              Add a daily comment about your experience and choose an emotional
              state (e.g., "very bad" to "very good") to see how your actions
              impact your mood and motivation over time.
            </span>
          </div>
          <div
            class="bg-white rounded-lg p-4 gap-3 flex-col flex transition transform hover:scale-105"
          >
            <h2 class="text-zinc-900 font-semibold">
              Step 6: Adjust and Celebrate Achievements
            </h2>
            <span class="text-zinc-600 text-sm">
              Regularly revisit and adjust your goals, milestones, or task
              difficulty as you progress. Celebrate your achievements as you
              reach new levels and milestones to stay inspired on your journey!
            </span>
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
