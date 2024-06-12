<script setup lang="ts">
import { RouterLink } from "vue-router";
import GroupIcon from "@/assets/icons/GroupIcon.svg?component";
import NotesIcon from "@/assets/icons/CreateNoteIcon.svg?component";
import EventsIcon from "@/assets/icons/JoinEventsIcon.svg?component";
import ThoughtsIcon from "@/assets/icons/ThoughtsIcon.svg?component";
</script>

<template>
  <main class="container overflow-auto">
    <div class="flex flex-col items-center p-6 gap-24">
      <div
        class="flex flex-col md:flex-row justify-between items-center text-center gap-12 gap-y-12 w-auto h-auto"
      >
        <div
          class="flex flex-col bg-black p-8 gap-6 border border-black bg-opacity-85 rounded-2xl md:w-[50%] md:h-[25%] w-[100%] h-[50%] container"
        >
          <h3 class="text-white font-bold text-xl">
            The perfect platform for creating a circle of interest
          </h3>
          <p class="text-white text-base">
            Alteranium connects students to each other to create an atmosphere
            where it is easy to learn and create projects
          </p>
          <div class="flex flex-row gap-6 justify-center">
            <RouterLink
              to="/register"
              class="bg-zinc-900 text-blue-500 font-bold px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white"
              >Join now</RouterLink
            >
            <RouterLink
              to="/login"
              class="bg-zinc-900 text-blue-500 font-bold px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white"
              >Log in</RouterLink
            >
          </div>
        </div>
        <a href="/">
          <img
            src="../assets/object.svg"
            alt="The perfect platform for creating a circle of interest"
            style="width: 250px; height: 250px"
          />
        </a>
      </div>
      <div
        class="flex flex-col bg-black p-8 gap-6 border border-black bg-opacity-85 rounded-2xl md:w-[50%] md:h-[25%] w-[100%] h-[50%]"
      >
        <h3 class="text-zinc-100 font-bold text-xl text-center">
          What can you do on the platform?
        </h3>
        <div class="flex flex-col md:flex-row justify-between gap-12">
          <div class="flex flex-col items-center gap-6">
            <GroupIcon class="w-8 h-8 text-zinc-100" />
            <span class="text-zinc-100 text-sm"
              >Join a special interest group (space)</span
            >
          </div>
          <div class="flex flex-col items-center gap-6">
            <NotesIcon class="w-8 h-8 text-zinc-100" />
            <span class="text-zinc-100 text-sm"
              >Create notes for the group</span
            >
          </div>
        </div>
        <div class="flex flex-col md:flex-row justify-between gap-12">
          <div class="flex flex-col items-center gap-6">
            <EventsIcon class="w-8 h-8 text-white" />
            <span class="text-zinc-100 text-sm"
              >Participate in activities to integrate with other group
              members</span
            >
          </div>
          <div class="flex flex-col items-center gap-6">
            <ThoughtsIcon class="w-8 h-8 text-zinc-100" />
            <span class="text-zinc-100 text-sm"
              >Sharing his thoughts on his wall</span
            >
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
