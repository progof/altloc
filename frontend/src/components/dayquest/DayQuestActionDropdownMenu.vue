<script setup lang="ts">
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import PlusIcon from "@/assets/icons/plus.svg?component";
import ChartIcon from "@/assets/icons/chart.svg?component";
import EditIcon from "@/assets/icons/edit.svg?component";
import DeleteIcon from "@/assets/icons/delete.svg?component";
import { useDeleteCategoryMutation } from "@/services/dayquest/category.service";

const props = defineProps<{ categoryId: string }>();

const emit = defineEmits<{
  (
    event: "openModal",
    dialogType: "create" | "edit" | "statistics" | "delete",
    categoryId: string
  ): void;
}>();

const { mutate: deleteCategory } = useDeleteCategoryMutation();

console.log("DayQuestActionDropdownMenu -> categoryId", props.categoryId);
</script>

<template>
  <DropdownMenuItem
    @click.prevent="emit('openModal', 'create', props.categoryId)"
  >
    <PlusIcon class="mr-2 size-4 stroke-[1.7] text-zinc-500" />
    Task
  </DropdownMenuItem>
  <DropdownMenuItem @click="emit('openModal', 'edit', props.categoryId)">
    <EditIcon class="mr-2 size-4 stroke-[1.5] text-zinc-500" />
    Edit
  </DropdownMenuItem>
  <DropdownMenuItem
    @click="emit('openModal', 'statistics', props.categoryId)"
    disabled
  >
    <ChartIcon class="mr-2 size-4 stroke-[1.5] text-zinc-500" />
    Chart
  </DropdownMenuItem>
  <DropdownMenuItem
    @click="
      () => {
        deleteCategory(props.categoryId);
      }
    "
  >
    <DeleteIcon class="mr-2 size-4 stroke-[1.5] text-zinc-500" />
    Delete
  </DropdownMenuItem>
</template>
