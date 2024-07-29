<script setup lang="ts">
import MainLayout from "@/layouts/MainLayout.vue";
import { buttonVariant } from "@/components/ui/button/";
import GroupIcon from "@/assets/icons/GroupIcon.svg?component";
import EventsIcon from "@/assets/icons/JoinEventsIcon.svg?component";
import NotesIcon from "@/assets/icons/NoteIcon.svg?component";
import ThoughtsIcon from "@/assets/icons/ThoughtsIcon.svg?component";
</script>

<template>
  <MainLayout>
    <section class="relative mt-3 p-6 md:px-10">
      <div class="container flex w-auto flex-col gap-12">
        <div class="flex-col md:flex-row justify-between flex gap-6">
          <div
            class="flex flex-col bg-indigo-200 p-6 gap-3 bg-opacity-80 rounded-xl w-auto"
          >
            <h3 class="text-zinc-800 font-bold text-xl flex justify-center">
              The perfect platform for creating a circle of interest
            </h3>
            <span class="text-zinc-500 text-base truncate">
              Alteranium connects students to each other to create an atmosphere
              where it is easy to learn and create projects
            </span>
            <div class="flex gap-3 justify-center mt-6">
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
          <a href="/">
            <img
              src="../assets/icons/object.svg"
              alt="The perfect platform for creating a circle of interest"
              class="size-48"
            />
          </a>
        </div>
        <div
          class="flex flex-col bg-indigo-200 p-6 gap-3 bg-opacity-80 rounded-xl"
        >
          <h3 class="text-zinc-700 font-bold text-xl text-center">
            What can you do on the platform?
          </h3>

          <div class="grid grid-cols-2 grid-rows-2 gap-3">
            <div class="flex flex-col items-center gap-6">
              <GroupIcon class="size-7 text-zinc-700 stroke-[1.5]" />
              <span class="text-zinc-500 text-sm truncate"
                >Join a special interest group (space)</span
              >
            </div>
            <div class="flex flex-col items-center gap-6">
              <NotesIcon class="size-7 text-zinc-700 stroke-[1.5]" />
              <span class="text-zinc-500 text-sm truncate"
                >Create notes for the group</span
              >
            </div>
            <div class="flex flex-col items-center gap-6">
              <EventsIcon cclass="size-7 text-zinc-700 stroke-[1.5]" />
              <span class="text-zinc-500 text-sm truncate"
                >Participate in activities to integrate with other group
                members</span
              >
            </div>
            <div class="flex flex-col items-center gap-6">
              <ThoughtsIcon class="size-7 text-zinc-700 stroke-[1.5]" />
              <span class="text-zinc-500 text-sm truncate"
                >Sharing his thoughts on his wall</span
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>
@/components/ui/button
