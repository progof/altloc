<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import AppLayout from "@/layouts/AppLayout.vue";
import { Button } from "@/components/ui/button/";
import { ref } from "vue";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { CreateDayQuestForm } from "@/components/create-dayquest-form";
import { categoriesQuery } from "@/services/dayquest/category.service";
import { CreateTaskDialogContent } from "@/components/tasks-table";
import { Checkbox } from "@/components/ui/checkbox";
import PlusIcon from "@/assets/icons/plus.svg?component";
import InfoIcon from "@/assets/icons/info.svg?component";
import ClipboardCheckIcon from "@/assets/icons/clipboard-check.svg?component";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DotsHorizontalIcon from "@/assets/icons/dots-horizontal.svg?component";
import CategoryActionDropdownMenu from "@/components/dayquest/CategoryActionDropdownMenu.vue";
import {
  useDeleteTaskMutation,
  useCompleteTaskMutation,
  useUnCompleteTaskMutation,
} from "@/services/dayquest/task.service";
import DeleteIcon from "@/assets/icons/delete.svg?component";
import { EditDayQuestForm } from "@/components/edit-dayquest-form";
import { Badge } from "@/components/ui/badge";

const { data: categories } = useQuery({
  ...categoriesQuery,
  enabled: true,
});

console.log(categories);

const { mutate: deleteTask, isPending: IsDeleteTaskPeding } =
  useDeleteTaskMutation();

const { mutate: completeTask } = useCompleteTaskMutation();
const { mutate: unCompleteTask } = useUnCompleteTaskMutation();

const isOpenDayQuestDialog = ref(false);
const isOpenTaskDialog = ref(false);
const isOpenEditTaskDialog = ref(false);
const modalProps = ref<{ categoryId: string }>();

function handleOpenModal(
  dialogType: "delete" | "edit" | "create" | "statistics",
  categoryId: string
) {
  console.log(dialogType, categoryId);
  if (dialogType === "create" && modalProps) {
    modalProps.value = { categoryId };
    isOpenTaskDialog.value = true;
  }
  if (dialogType === "edit" && modalProps) {
    modalProps.value = { categoryId };
    isOpenEditTaskDialog.value = true;
  }
}
</script>

<template>
  <AppLayout>
    <section class="relative mt-3 p-3 px-6 md:px-10">
      <div class="container flex w-auto flex-col gap-1">
        <div class="flex flex-col gap-6">
          <div
            class="flex justify-between items-center border-b border-zinc-700 py-3"
          >
            <h2 class="text-xl font-bold tracking-tight text-zinc-700">
              DayQuest
            </h2>

            <Button
              size="md"
              @click="
                () => {
                  isOpenDayQuestDialog = true;
                }
              "
              class="bg-blue-400 hover:bg-blue-600 p-2 rounded-full"
              title="Create new category"
              alt="Create new category"
            >
              <PlusIcon class="size-8 stroke-[3] text-white" />
            </Button>
          </div>

          <div
            class="flex items-center gap-3 bg-blue-100 p-3 rounded-2xl drop-shadow-lg"
          >
            <InfoIcon class="size-6 stroke-[2] text-zinc-500 shrink-0" />
            <span class="text-xs text-zinc-500 font-semibold">
              Create categories of skills that you want to pump every day, and
              then add tasks to them
            </span>
          </div>

          <div
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2 mt-5"
          >
            <div
              class="flex flex-col gap-6 bg-blue-200 p-3 rounded-xl flex-1"
              v-for="category in categories"
              :key="category.id"
            >
              <div class="flex flex-col gap-3">
                <div class="flex items-center gap-3 justify-between">
                  <div class="flex gap-3 items-center justify-center">
                    <span class="size-3 rounded-full bg-blue-500"></span>
                    <span class="text-zinc-700 font-semibold">
                      {{ category.name }}
                    </span>
                  </div>
                  <DropdownMenu :modal="false">
                    <DropdownMenuTrigger
                      class="flex items-center p-1 hover:bg-black/5 rounded data-[state=open]:bg-black/5"
                    >
                      <DotsHorizontalIcon
                        class="size-5 stroke-[1.75] text-zinc-600"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="min-w-40">
                      <CategoryActionDropdownMenu
                        :categoryId="category.id"
                        @openModal="handleOpenModal"
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div class="flex gap-3">
                  <div
                    class="flex gap-10 items-center justify-center bg-blue-50 p-1.5 rounded-xl flex-1"
                  >
                    <!-- <div
                      class="text-zinc-500 text-xs font-semibold flex gap-1.5"
                      v-if="category.tasks.length"
                    >
                      <ClipboardCheckIcon
                        class="size-4 stroke-[1.5] text-zinc-700"
                      />
                      <span>
                        {{
                          category.tasks.filter((task) => task.isCompleted)
                            .length
                        }}
                        / {{ category.tasks.length }}
                      </span>
                    </div> -->
                    <span
                      class="text-zinc-500 text-xs font-semibold"
                      v-if="category.tasks.length"
                    >
                      Completed:
                      {{
                        category.tasks.filter((task) => task.isCompleted).length
                      }}
                      / {{ category.tasks.length }}
                    </span>
                    <span class="text-zinc-500 text-xs font-semibold">
                      Tasks: {{ category.tasks.length }} / 5
                    </span>
                  </div>
                  <Button
                    size="sm"
                    @click="
                      () => {
                        isOpenTaskDialog = true;
                        modalProps = { categoryId: category.id };
                      }
                    "
                    class="bg-blue-50 hover:bg-blue-400 p-2 rounded-2xl text-zinc-600 hover:text-zinc-50"
                  >
                    <PlusIcon class="size-5 stroke-[2]" />
                  </Button>
                </div>
              </div>
              <ul>
                <li
                  v-for="task in category.tasks"
                  :key="task.id"
                  class="flex items-center gap-2 justify-between bg-blue-50 p-3 rounded-xl mb-3 shadow-lg"
                  v-if="category.tasks"
                >
                  <div class="flex items-center gap-3">
                    <Checkbox
                      :id="task.id"
                      :modelValue="task.isCompleted"
                      @click="
                        () => {
                          if (!task.isCompleted) {
                            completeTask(task.id);
                          } else {
                            unCompleteTask(task.id);
                          }
                        }
                      "
                    />
                    <div class="flex flex-col gap-3">
                      <!-- <span
                        :for="task.id"
                        class="text-zinc-500 data-[state=checked]:line-through"
                      >
                        {{ task.name }}
                      </span> -->
                      <span
                        :for="task.id"
                        :class="{ 'line-through': task.isCompleted }"
                        class="text-zinc-500"
                      >
                        {{ task.name }}
                      </span>

                      <div class="flex gap-3 items-center">
                        <Badge size="sm" variant="blue">
                          {{ task.priority }}
                        </Badge>
                        <Badge size="sm" variant="green">
                          {{ task.difficulty }}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    :desibled="IsDeleteTaskPeding"
                    class="bg-transparent hover:bg-transparent p-1"
                    @click="
                      () => {
                        deleteTask(task.id);
                      }
                    "
                  >
                    <DeleteIcon
                      class="size-5 text-red-300 hover:text-red-500"
                    />
                  </Button>
                </li>
                <li v-if="category.tasks.length === 0" class="text-zinc-500">
                  <span
                    class="text-zinc-600 flex items-center justify-center my-48 font-semibold"
                    >No tasks yet</span
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </AppLayout>
  <Dialog v-model:open="isOpenDayQuestDialog">
    <DialogContent>
      <CreateDayQuestForm @close="isOpenDayQuestDialog = false" />
      <DialogClose />
    </DialogContent>
  </Dialog>
  <Dialog v-model:open="isOpenTaskDialog">
    <DialogContent>
      <CreateTaskDialogContent
        v-if="modalProps"
        @close="isOpenTaskDialog = false"
        v-bind="modalProps"
      />
      <DialogClose />
    </DialogContent>
  </Dialog>
  <Dialog v-model:open="isOpenEditTaskDialog">
    <DialogContent>
      <EditDayQuestForm
        v-if="modalProps"
        @close="isOpenEditTaskDialog = false"
        v-bind="modalProps"
      />
      <DialogClose />
    </DialogContent>
  </Dialog>
</template>
