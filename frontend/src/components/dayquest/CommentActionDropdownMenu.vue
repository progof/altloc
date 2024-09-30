<script setup lang="ts">
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import EditIcon from "@/assets/icons/edit.svg?component";
import DeleteIcon from "@/assets/icons/delete.svg?component";
import { useDeleteCommentMutation } from "@/services/dayquest/comment.service";
import { UserComment } from "@shared/index";

const props = defineProps<{ comment: UserComment }>();

const emit = defineEmits<{
  (
    event: "openModal",
    dialogType: "create" | "edit" | "statistics" | "delete",
    comment: UserComment
  ): void;
}>();

const { mutate: deleteComment } = useDeleteCommentMutation();

console.log("DayQuestActionDropdownMenu -> categoryId", props.comment.id);
</script>

<template>
  <DropdownMenuItem @click="emit('openModal', 'edit', props.comment)">
    <EditIcon class="mr-2 size-4 stroke-[1.5] text-zinc-500" />
    <span class="text-zinc-700">Edit</span>
  </DropdownMenuItem>
  <DropdownMenuItem
    @click="
      () => {
        deleteComment(props.comment.id);
      }
    "
  >
    <DeleteIcon class="mr-2 size-4 stroke-[1.5] text-zinc-500" />
    <span class="text-zinc-700">Delete</span>
  </DropdownMenuItem>
</template>
