<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { getSpaceQueryOptions } from "@/services/spaces.service";
import SideBarNav from "@/components/SideBarNav.vue";

const route = useRoute();
const spaceId: string = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

console.log("spaceId", spaceId);
const { data: space } = useQuery(getSpaceQueryOptions(spaceId));

console.log("DEBUG", space.value?.title);

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleString();
};
</script>

<template>
  <SideBarNav />
  <div class="note-section">
    <div class="wrapper">
      <div v-if="space" class="note">
        <div class="note-header">
          <h3>Title: {{ space.title }}</h3>
          <hr />
        </div>

        <div class="note-info">
          <div class="note-description">
            <p><strong>Description:</strong> {{ space.description }}</p>
          </div>

          <div class="note-category">
            <p><strong>Category:</strong> {{ space.category }}</p>
          </div>

          <div class="note-author" style="color: rgb(91, 92, 93)">
            <p><strong>Author:</strong> {{ space.username }}</p>
            <MyButton
              @click="$router.push(`/users/${space.user_id}`)"
              style="color: rgb(166, 141, 228)"
            >
              Profile(Test)
            </MyButton>
          </div>

          <div class="note-created_at" style="color: rgb(91, 92, 93)">
            <p>
              <strong>Created at:</strong>
              {{ formatCreatedAt(space.created_at) }}
            </p>
          </div>

          <div
            v-if="space.edit_at"
            class="space-edit_at"
            style="color: rgb(91, 92, 93)"
          >
            <p>
              <strong>Edit at:</strong> {{ formatCreatedAt(space.edit_at) }}
            </p>
          </div>

          <div class="spaceId" style="color: rgb(91, 92, 93)">
            <p><strong>Space ID:</strong> {{ space.space_id }}</p>
          </div>
        </div>
      </div>

      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background-color: rgb(15, 14, 14);
  color: azure;
  height: 100vh;
}

/* .wrapper {
  max-width: 1060px;
  margin: 0 auto;
} */

h3,
p {
  color: rgb(55, 146, 225);
  padding-bottom: 10px;
}

.note-description p,
.note-body p,
.note-category p,
.note-created_at p,
.note-author p,
.noteID p {
  margin-bottom: 10px;
}

.note-description,
.note-body,
.note-category,
.note-created_at,
.note-author,
.noteID {
  margin-top: 20px;
}

.noteID p {
  font-weight: bold;
}

/* Additional styles for MyButton component */
.note-button {
  margin-top: 20px;
}
.note-header h3 {
  color: rgb(55, 146, 225);
  margin-bottom: 15px;
}

.note-info {
  margin-top: 20px;
}

.note-info p {
  margin-bottom: 10px;
}

.note-info p strong {
  margin-right: 5px;
}
</style>
