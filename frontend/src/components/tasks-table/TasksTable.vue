<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { useQuery } from "@tanstack/vue-query";
import { useField } from "vee-validate";
import { computed, h, ref, watch, toRaw } from "vue";
import CreateTaskDialogContent from "./CreateTaskDialogContent.vue";
import Button from "@/components/ui/button/Button.vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableCellContent,
  type TableColumnDef,
} from "@/components/ui/table";
import {
  Task,
  useDeleteTaskMutation,
  tasksQuery,
} from "@/services/dayquest/task.service";

const props = defineProps<{ name: string; categoryId: string }>();

const { errorMessage, resetField } = useField<string[]>(props.name);

const { data: tasks } = useQuery({
  ...tasksQuery,
  enabled: true,
});
const { mutate: deleteTask } = useDeleteTaskMutation();

const columns: TableColumnDef<{
  data: Task;
}>[] = [
  {
    key: "task",
    header: "Task",
    headerAttributes: {
      align: "left",
      class: "pl-4",
    },
    cellAttributes: {
      align: "left",
      class: "pl-4",
    },
    cell: ({ row }) => {
      const task = row.data;
      return h("div", { class: "flex items-center gap-2.5" }, [
        h("div", { class: "flex flex-1 flex-col" }, [
          h("span", { class: "text-sm font-semibold" }, task.name),
          task.name
            ? h("p", { class: "text-sm font-medium text-zinc-500" }, task.name)
            : null,
        ]),
      ]);
    },
  },
  {
    key: "actions",
    header: () => null,
    headerAttributes: {
      align: "right",
    },
    cellAttributes: {
      align: "right",
    },
    cell: ({ row }) => {
      return h(
        "button",
        {
          type: "button",
          class: "text-sm font-medium text-zinc-500 hover:text-red-500",
          onClick: () => {
            deleteTask(row.data.id);
          },
        },
        "Delete"
      );
    },
  },
];

const rows = computed(() => {
  if (!tasks.value) return [];
  return tasks.value.map((task) => ({
    data: toRaw(task),
    selected: ref(false),
  }));
});

const selectedTasks = computed(() => {
  return rows.value.filter((row) => row.selected.value).map((row) => row.data);
});

watch(selectedTasks, () => {
  resetField({
    value: selectedTasks.value.map((task) => task.id),
  });
});

const isDialogOpen = ref(false);
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between py-4">
      <h2 class="text-xl font-semibold">Tasks</h2>
      <Dialog v-model:open="isDialogOpen">
        <DialogTrigger as-child>
          <Button size="sm">Create task</Button>
        </DialogTrigger>
        <DialogContent>
          <CreateTaskDialogContent @close="isDialogOpen = false" />
          <DialogClose />
        </DialogContent>
      </Dialog>
    </div>
    <div class="overflow-x-auto overflow-y-hidden">
      <Table>
        <TableHeader>
          <tr>
            <TableHeaderCell
              v-for="col in columns"
              :key="col.key"
              scope="col"
              v-bind="col.headerAttributes"
            >
              <TableCellContent :render="col.header" :props="{ rows }" />
            </TableHeaderCell>
          </tr>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in rows" :key="row.data.id">
            <TableCell
              v-for="col in columns"
              :key="col.key"
              v-bind="col.cellAttributes"
            >
              <TableCellContent :render="col.cell" :props="{ row }" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <span v-if="errorMessage" class="mt-2 text-xs font-medium text-red-500">
      {{ errorMessage }}
    </span>
  </div>
</template>
