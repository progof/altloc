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
      <div class="container flex flex-col gap-12">
        <div class="group relative overflow-hidden rounded-3xl">
          <img
            src="/images/gamification.png"
            alt="Conference poster"
            class="aspect-video object-cover w-full h-auto"
          />
          <div
            class="absolute inset-0 z-[1] flex items-center justify-center bg-gradient-to-b from-blue-200/20 to-blue-400/60 p-2"
          >
            <h1
              class="md:text-5xl text-2xl font-bold tracking-tight text-zinc-700 items-center justify-center"
            >
              Switch to gamification: <br />turn habits into exciting quests!
            </h1>
          </div>
        </div>

        <div class="flex flex-col md:flex-row gap-12 items-center">
          <div
            class="flex flex-col gap-3 bg-blue-200 p-6 bg-opacity-80 rounded-xl h-auto"
          >
            <div class="flex gap-3 items-center">
              <h3 class="font-semibold text-lg text-zinc-900">
                DayQuest: Develop Your Skills
              </h3>
              <GameControllerIcon
                class="mr-2 size-7 stroke-[1.7] text-zinc-800"
              />
            </div>
            <p class="text-zinc-500">
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
            class="flex flex-col gap-3 bg-blue-200 p-6 bg-opacity-80 rounded-xl h-auto"
          >
            <div class="flex gap-3 items-center">
              <h3 class="font-semibold text-lg text-zinc-900">
                DayComment: Record Your Thoughts
              </h3>
              <CommentIcon class="mr-2 size-7 stroke-[1.7] text-zinc-800" />
            </div>
            <p class="text-zinc-500">
              Record how your day went and assess your emotional state. All
              entries will be private and visible only to you. This will help
              you become aware of your feelings, capture important moments, and
              better understand yourself. Every day is a new opportunity for
              growth and self-reflection. Start documenting your thoughts and
              feelings today!
            </p>
          </div>
        </div>

        <!-- <div
          class="flex flex-col bg-blue-200 p-6 gap-3 bg-opacity-80 rounded-xl"
        >
          <h3 class="font-semibold text-lg text-zinc-900 flex justify-center">
            The perfect platform for creating a circle of interest
          </h3>
          <span class="text-zinc-700">
            AltLoc brings students together, creating an atmosphere where it is
            easy to learn and realize projects. Join a community of like-minded
            people and discover new opportunities for joint creativity and
            learning.
          </span>
          <div class="flex gap-3 justify-center mt-2">
            <a
              :class="
                buttonVariant({
                  size: 'xl',
                  variant: 'primary',
                  class: 'shrink-0 ',
                })
              "
              href="/auth/register"
            >
              <span class="flex items-center font-semibold">
                Join us
                <SpaceShipIcon class="ml-2 size-5 stroke-[1.7] text-blue-50" />
              </span>
            </a>
          </div>
        </div>

        <div
          class="flex flex-col gap-3 bg-blue-200 p-6 bg-opacity-80 rounded-xl"
        >
          <div class="flex gap-3 items-center">
            <h3 class="font-semibold text-lg text-zinc-900">
              Gamification of your life
            </h3>
            <GameControllerIcon
              class="mr-2 size-7 stroke-[1.7] text-zinc-800"
            />
          </div>
          <p class="text-zinc-500">
            Turn routine into an exciting game! Our web application helps you
            manage your daily tasks, develop healthy habits and make time for
            what really matters. With the gamification system, every step you
            take will be rewarded and your motivation to reach your goals will
            increase. Manage your time and reach new heights in your personal
            and professional life!
          </p>
        </div>
        <div
          class="flex flex-col gap-3 bg-blue-200 p-6 bg-opacity-80 rounded-xl"
        >
          <div class="flex gap-3 items-center">
            <h3 class="font-semibold text-lg text-zinc-900">
              Community of interest
            </h3>
            <CommentIcon class="mr-2 size-7 stroke-[1.7] text-zinc-800" />
          </div>
          <p class="text-zinc-500">
            Find like-minded people and expand your social circle! Our hobby and
            interest matching service helps you find people who share your
            hobbies. Whether it's sports, reading, traveling or any other hobby
            - now you can easily connect with people who understand and support
            you. Together with friends and new acquaintances you can achieve
            more, making your everyday life brighter and more interesting.
          </p>
        </div>
        <div
          class="flex flex-col gap-3 bg-blue-200 p-6 bg-opacity-80 rounded-xl"
        >
          <div class="flex gap-3 items-center">
            <h3 class="font-semibold text-lg text-zinc-900">
              Time control with Day Balance
            </h3>
            <ScalesIcon class="mr-2 size-7 stroke-[1.7] text-zinc-800" />
          </div>
          <p class="text-zinc-500">
            You don't know where your time is going? We can help you find out!
            With Day Balance you can analyze in detail how your days are
            distributed. Track your time spent on different activities, create
            the perfect daily balance and increase your productivity. With
            simple visualization and useful analytics, you can effectively
            manage your resources and get more done in less time.
          </p>
        </div> -->
      </div>
    </section>
  </MainLayout>
</template>
