<script setup lang="ts">
import MainLayout from "@/layouts/MainLayout.vue";
import { getMeQueryOptions } from "@/services/user.service";
import { useQuery } from "@tanstack/vue-query";
import { buttonVariant } from "@/components/ui/button";

const { data: user } = useQuery(getMeQueryOptions);
</script>
<template>
  <MainLayout>
    <section class="relative mt-12 px-3 md:px-10 h-screen">
      <div class="container flex w-auto flex-col gap-6">
        <div class="flex flex-col items-center gap-4">
          <h1 class="text-4xl font-semibold text-red-300">404</h1>
          <span class="text-zinc-800 text-lg font-semibold">
            Resource not found
          </span>
          <span class="text-zinc-600">
            The page you are looking for doesn't exist or has been moved.
          </span>

          <div class="flex gap-4">
            <a
              v-if="!user"
              :class="
                buttonVariant({
                  size: 'sm',
                  class: 'shrink-0',
                  variant: 'tertiary',
                })
              "
              href="/"
            >
              Go back to home
            </a>
            <a
              v-if="user"
              :class="
                buttonVariant({
                  size: 'sm',
                  class: 'shrink-0 ',
                  variant: 'tertiary',
                })
              "
              href="/user/day-quest"
            >
              Go to dashboard
            </a>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>
