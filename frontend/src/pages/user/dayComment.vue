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
import CalendarIcon from "@/assets/icons/calendar.svg?component";
import EmotionIcon from "@/assets/icons/emotion.svg?component";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DotsHorizontalIcon from "@/assets/icons/dots-horizontal.svg?component";
import CommentActionDropdownMenu from "@/components/dayquest/CommentActionDropdownMenu.vue";
import { formatDateToMonthDay } from "@/utils/dayjs";
import { UserComment } from "@shared/index";
import InfoIcon from "@/assets/icons/info.svg?component";

const { data: comments } = useQuery({
  ...commentsQuery,
  enabled: true,
});

const isOpenDayQuestDialog = ref(false);
const isOpenEditCommentDialog = ref(false);
const modalProps = ref<{ comment: UserComment }>();

function handleOpenModal(
  dialogType: "delete" | "edit" | "create" | "statistics",
  comment: UserComment
) {
  console.log(dialogType, comment);
  if (dialogType === "edit" && modalProps) {
    modalProps.value = { comment };
    isOpenEditCommentDialog.value = true;
  }
}

function getEmotionalStateIcon(emotionalState: string) {
  switch (emotionalState) {
    case "VERY_BAD":
      return "Very bad 😭";
    case "BAD":
      return "Bad 😞";
    case "NEUTRAL":
      return "Neutral 😐";
    case "GOOD":
      return "Good 😊";
    case "VERY_GOOD":
      return "Very good 😍";
    default:
      return "😐";
  }
}
</script>

<template>
  <AppLayout>
    <section class="relative p-3 px-6 md:px-10">
      <div class="container flex w-auto flex-col gap-1">
        <div class="flex flex-col gap-6">
          <div
            class="flex justify-between items-center border-b border-blue-600 py-3"
          >
            <h2 class="text-xl font-bold tracking-tight text-zinc-700">
              DayComment
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
              Write a short note about what you remembered today and evaluate
              your emotional well-being.
            </span>
          </div>

          <div
            v-if="comments && comments.length > 0"
            class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2 min-w-[300px] mt-5"
          >
            <div
              class="flex flex-col gap-3 bg-blue-200 p-3 rounded-xl w-full flex-1"
              v-for="comment in comments"
              :key="comment.id"
            >
              <div
                class="flex items-center gap-1 justify-between"
                v-if="comment.id"
              >
                <div
                  class="flex gap-10 items-center bg-blue-50 p-1.5 rounded-xl px-3 w-full"
                >
                  <div class="flex gap-2 items-center">
                    <CalendarIcon class="size-5 stroke-[1.7] text-zinc-700" />
                    <span class="text-zinc-500 text-sm font-semibold">
                      {{ formatDateToMonthDay(comment.createdAt) }}
                    </span>
                  </div>
                  <div class="flex gap-2 items-center">
                    <EmotionIcon class="size-5 stroke-[1.7] text-zinc-700" />
                    <span class="text-zinc-500 text-sm font-semibold">
                      {{ getEmotionalStateIcon(comment.emotionalState) }}
                    </span>
                  </div>
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
                      :comment="comment"
                      @openModal="handleOpenModal"
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div class="flex flex-col">
                <span
                  class="text-zinc-600 text-sm bg-blue-50 p-3 rounded-xl h-auto shadow-lg"
                >
                  {{ comment.description }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="text-zinc-500 mt-5">
            <span
              class="text-zinc-700 flex items-center justify-center font-semibold"
            >
              No comment yet
            </span>
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
