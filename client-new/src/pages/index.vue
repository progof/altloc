<script setup lang="ts">
import MainLayout from "@/layouts/MainLayout.vue";
import { buttonVariant } from "@/components/ui/button/";
</script>

<template>
  <MainLayout>
    <section class="relative mt-3 p-6 md:px-10">
      <div class="container flex flex-col gap-12">
        <div
          class="flex flex-col bg-indigo-200 p-6 gap-3 bg-opacity-80 rounded-xl"
        >
          <h3 class="text-zinc-900 font-medium text-xl flex justify-center">
            The perfect platform for creating a circle of interest
          </h3>
          <span class="text-zinc-500">
            ISotus brings students together, creating an atmosphere where it is
            easy to learn and realize projects. Join a community of like-minded
            people and discover new opportunities for joint creativity and
            learning.
          </span>
          <div class="flex gap-3 justify-center mt-2">
            <a
              :class="
                buttonVariant({
                  size: 'md',
                  variant: 'secondary',
                  class: 'shrink-0 bg-indigo-50',
                })
              "
              href="/auth/login"
            >
              Log in
            </a>
            <a
              :class="buttonVariant({ size: 'md', class: 'shrink-0' })"
              href="/auth/register"
            >
              Register
            </a>
          </div>
        </div>

        <div
          class="flex flex-col gap-3 bg-indigo-200 p-6 bg-opacity-80 rounded-xl"
        >
          <h3 class="font-medium text-xl text-zinc-900">
            Gamification of your life
          </h3>
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
          class="flex flex-col gap-3 bg-indigo-200 p-6 bg-opacity-80 rounded-xl"
        >
          <h3 class="font-medium text-xl text-zinc-900">
            Community of interest
          </h3>
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
          class="flex flex-col gap-3 bg-indigo-200 p-6 bg-opacity-80 rounded-xl"
        >
          <h3 class="font-medium text-xl text-zinc-900">
            Time control with Day Balance
          </h3>
          <p class="text-zinc-500">
            You don't know where your time is going? We can help you find out!
            With Day Balance you can analyze in detail how your days are
            distributed. Track your time spent on different activities, create
            the perfect daily balance and increase your productivity. With
            simple visualization and useful analytics, you can effectively
            manage your resources and get more done in less time.
          </p>
        </div>
      </div>
    </section>
  </MainLayout>
</template>
@/components/ui/button
