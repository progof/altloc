<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { getMeQueryOptions } from "@/services/auth.service";
import { getSpaceEventQueryOptions } from "@/services/event.service";

import SideBarNav from "@/components/SideBarNav.vue";
import SpaceMenu from "@/components/space/SpaceMenu.vue";
import SpaceDashboard from "@/components/space/SapceDashboard.vue";

import EventForm from "@/components/event/EventForm.vue";
import UserProfile from "@/assets/icons/UserProfile.svg?component";
import SpacesIcon from "@/assets/icons/SpacesIcon.svg?component";
import { MyButton } from "@/components/UI";

const { data: me } = useQuery(getMeQueryOptions);

const route = useRoute();
const spaceId: string = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

console.log("Event page space_id", spaceId);
console.log("Event page user_id", me.value?.user_id);
const { data: spaceEvents } = useQuery(getSpaceEventQueryOptions(spaceId));
console.log("Event page data:", spaceEvents);

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleString();
};

function htmlToFormattedText2(html: string) {
  let tempElement = document.createElement("div");
  tempElement.innerHTML = html;

  return tempElement.innerHTML;
}
</script>

<template>
  <div class="conteiner">
    <SideBarNav />
    <div class="profile">
      <div class="wrapper">
        <SpaceDashboard />
        <SpaceMenu />
        <div class="event">
          <EventForm :spaceId="spaceId" />
          <div class="note-lists" v-if="spaceEvents">
            <h2>List of events</h2>
            <ul v-if="spaceEvents.length > 0">
              <li v-for="spaceEvent in spaceEvents" :key="spaceEvent.space_id">
                <div class="post-card">
                  <div class="dashboard__face">
                    <div class="space-owners">
                      <SpacesIcon
                        style="width: 32px; height: 32px; margin: 20px"
                      />
                      <span style="font-size: 12px; font-weight: bold">{{
                        spaceEvent.spacename
                      }}</span>
                    </div>
                    <div class="space-owners">
                      <UserProfile
                        style="width: 32px; height: 32px; margin: 20px"
                      />
                      <MyButton
                        @click="$router.push(`/users/${spaceEvent.creator}`)"
                        style="
                          font-weight: bold;
                          font-size: 12px;
                          background-color: rgba(15, 14, 14, 0.1);
                        "
                      >
                        {{ spaceEvent.username }}
                      </MyButton>
                    </div>
                  </div>
                  <div class="time-event">
                    <span style="margin: 10px"
                      >Start: {{ spaceEvent.start_time }}</span
                    >
                    <span style="margin: 10px"
                      >End: {{ spaceEvent.end_time }}</span
                    >
                    <span style="margin: 10px"
                      >Date: {{ formatCreatedAt(spaceEvent.date) }}</span
                    >
                  </div>
                  <span
                    class="post-content"
                    v-html="htmlToFormattedText2(spaceEvent.description)"
                  ></span>
                  <span style="margin-top: 10px; font-size: 12px"
                    >Created at:
                    {{ formatCreatedAt(spaceEvent.created_at) }}</span
                  >
                  <!-- <div class="user-active">
                    <LikeForNote
                      :noteId="note.note_id"
                      :noteLike="note.likes"
                    />
                    <CommentForNote :noteId="note.note_id" />
                    <SavedNote :noteId="note.note_id" />
                    <ShareNote :noteId="note.note_id" />
                  </div> -->
                </div>
              </li>
            </ul>
          </div>
          <div v-else>
            <p class="no-notes-message">No events available.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile {
  flex: 1 1 0%;
  min-height: 100vh; /* Change height to min-height */
}

.wrapper {
  max-width: 1024px;
  padding: 50px;
  height: 100%;
  background-color: rgba(15, 14, 14, 0.9);
  color: azure;
  margin: 0 auto;
}

.container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}

.event {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  /* background-color: rgba(15, 14, 14, 0.9); */
  color: azure;
  /* height: 100vh; */
}

.space-owners {
  margin: 15px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
}

.time-event {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: rgb(37, 136, 222);
  border-radius: 20px;
}

.post-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  padding: 10px;
}

.user-active {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 10px;
}

.post-content {
  padding: 10px;
  margin-top: 10px;
}

.note-lists {
  margin-top: 10px;
  height: 450px;
  overflow: scroll;
  align-items: center;
  justify-content: center;
}

.note-lists h2 {
  color: rgb(55, 146, 225);
  font-size: 16px;
  margin-bottom: 10px;
}

.note-lists ul {
  list-style-type: none;
  padding: 0;
}

.note-lists li {
  margin-bottom: 10px;
  padding: 10px;
  /* position: relative; */
  margin-top: 20px;
}

.note-lists h3 {
  color: rgb(55, 146, 225);
  margin-bottom: 5px;
}

.note-lists p {
  margin-bottom: 5px;
  color: #959595;
}

.open-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #5de1ed;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 30px;
}

.no-notes-message {
  color: #666;
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
}

.dashboard__face {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
}
</style>
