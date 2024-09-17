<script setup lang="ts">
import { DialogTitle } from "@/components/ui/dialog";
import { TasksTable } from "@/components/tasks-table";

const props = defineProps<{
  conferenceId: string;
}>();

defineEmits<{ close: [] }>();
</script>

<template>
  <DialogTitle class="mb-4 text-xl font-bold tracking-tight">
    Create tasks for your DayQuest
  </DialogTitle>

  <TasksTable name="test" :categoryId="props.conferenceId" />
</template>
