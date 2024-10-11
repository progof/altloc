<script setup lang="ts">
import { z } from "zod";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  useUpdateCommentMutation,
  commentsQuery,
} from "@/services/dayquest/comment.service";
import { TextArea } from "@/components/ui/text-area";
import LoaderIcon from "@/assets/icons/loader.svg?component";
import { Button } from "@/components/ui/button";
import { FetchError } from "@/utils/fetch";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/vue-query";
import { watch } from "vue";
import { UserComment } from "@shared/index";

const props = defineProps<{
  comment: UserComment;
}>();

const { handleSubmit, meta, setFieldError, resetForm } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      description: z.string().min(1).max(256),
    })
  ),
});

const { data: comments } = useQuery(commentsQuery);
console.log("comment:", comments);
watch(
  comments,
  () => {
    const comment = comments.value?.find(
      (comment) => comment.id === props.comment.id
    );
    console.log("comment:", comment);
    if (comment) {
      resetForm({
        values: {
          description: comment.description,
        },
      });
    }
  },
  {
    immediate: true,
  }
);

const emit = defineEmits<{ close: [] }>();
const { mutate: updateComment, isPending } = useUpdateCommentMutation();

const onSubmit = handleSubmit((data) => {
  console.log("Update dayComment -> data:", data);
  updateComment(
    {
      commentId: props.comment.id,
      body: data,
    },
    {
      onSuccess: () => {
        // location.assign("/user/day-comment");
        emit("close");
      },
      onError: async (error) => {
        if (error instanceof FetchError) {
          setFieldError("description", error.message);
        }
      },
    }
  );
});
</script>

<template>
  <DialogTitle class="text-xl font-bold tracking-tight">
    Edit comment
  </DialogTitle>
  <DialogDescription class="mt-2 text-sm text-zinc-500">
    You can update your comment of the day.
  </DialogDescription>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-3 mt-5">
    <TextArea
      name="description"
      label="Description"
      placeholder="Business"
      class="text-zinc-600"
    />

    <div class="mt-4 flex justify-end pt-4">
      <Button
        :disabled="!meta.dirty || isPending"
        class="relative font-semibold"
      >
        <LoaderIcon
          v-if="isPending"
          class="absolute mx-auto size-5 animate-spin stroke-[1.5]"
        />
        <span :class="isPending ? 'invisible' : ''">Edit comment</span>
      </Button>
    </div>
  </form>
</template>
