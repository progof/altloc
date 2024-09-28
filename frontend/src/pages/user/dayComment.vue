<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import AppLayout from "@/layouts/AppLayout.vue";
import { Button } from "@/components/ui/button/";
import { ref } from "vue";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import {
  EditDayCommentForm,
  CreateDayCommentForm,
} from "@/components/daycomment-forms/";
import { commentsQuery } from "@/services/dayquest/comment.service";
import PlusIcon from "@/assets/icons/plus.svg?component";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DotsHorizontalIcon from "@/assets/icons/dots-horizontal.svg?component";
import CommentActionDropdownMenu from "@/components/dayquest/CommentActionDropdownMenu.vue";
// import { dateToUTCTimestamp } from "@/utils/date";
// import { formatFullDateTime } from "@/utils/dayjs";

const { data: comments } = useQuery({
  ...commentsQuery,
  enabled: true,
});

console.log(comments);

const isOpenDayQuestDialog = ref(false);
const isOpenEditCommentDialog = ref(false);
const modalProps = ref<{ commentId: string }>();

function handleOpenModal(
  dialogType: "delete" | "edit" | "create" | "statistics",
  commentId: string
) {
  console.log(dialogType, commentId);
  if (dialogType === "edit" && modalProps) {
    modalProps.value = { commentId };
    isOpenEditCommentDialog.value = true;
  }
}
</script>

<template>
  <AppLayout>
    <section class="relative mt-6 px-3 md:px-10">
      <div class="container flex w-auto flex-col gap-6">
        <div class="flex flex-col gap-3">
          <div class="flex justify-between">
            <h2 class="text-xl font-bold tracking-tight">DayComment</h2>

            <Button
              size="md"
              @click="
                () => {
                  isOpenDayQuestDialog = true;
                }
              "
            >
              <PlusIcon class="size-5 stroke-[1.9] text-zinc-50" />
            </Button>
          </div>

          <div
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-2 min-w-[300px]"
          >
            <div
              class="flex flex-col gap-6 bg-blue-100 p-3 rounded-xl w-full flex-1"
              v-for="comment in comments"
              :key="comment.id"
            >
              <div
                class="flex items-center gap-3 justify-between"
                v-if="comment.id"
              >
                <div class="flex flex-col gap-3">
                  <span class="text-zinc-400 text-[12px]">
                    {{ comment.createdAt }}
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
                    <CommentActionDropdownMenu
                      :commentId="comment.id"
                      @openModal="handleOpenModal"
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div class="flex flex-col gap-3">
                <span class="text-zinc-600 text-sm">
                  {{ comment.description }}
                </span>
              </div>
              <div v-if="!comment.id" class="text-zinc-500">
                <span
                  class="text-zinc-400 flex items-center justify-center font-semibold"
                  >No comment yet</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </AppLayout>
  <Dialog v-model:open="isOpenDayQuestDialog">
    <DialogContent>
      <CreateDayCommentForm @close="isOpenDayQuestDialog = false" />
      <DialogClose />
    </DialogContent>
  </Dialog>
  <Dialog v-model:open="isOpenEditCommentDialog">
    <DialogContent>
      <EditDayCommentForm
        v-if="modalProps"
        @close="isOpenEditCommentDialog = false"
        v-bind="modalProps"
      />
      <DialogClose />
    </DialogContent>
  </Dialog>
</template>
