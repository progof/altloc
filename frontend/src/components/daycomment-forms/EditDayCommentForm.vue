<script setup lang="ts">
import { z } from "zod";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  useUpdateCommentMutation,
  meCommentQuery,
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

defineEmits<{ close: [] }>();

const { data: comment } = useQuery({
  ...meCommentQuery(props.comment.id),
  initialData: props.comment,
});

watch(
  comment,
  () => {
    if (!comment.value) return;
    resetForm({
      values: {
        description: comment.value.description,
      },
    });
  },
  {
    immediate: true,
  }
);

const { mutate: updateComment, isPending } = useUpdateCommentMutation();

const onSubmit = handleSubmit((data) => {
  console.log("Create dayComment -> data:", data);
  updateComment(
    {
      commentId: props.comment.id,
      body: data,
    },
    {
      onSuccess: () => {
        location.assign("/user/day-comment");
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
  <DialogTitle class="text-xl font-bold tracking-tight">Edit</DialogTitle>
  <DialogDescription class="mt-2 text-sm text-zinc-500">
    Edit the comment
  </DialogDescription>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-3 mt-2">
    <TextArea name="description" label="Description" placeholder="Business" />

    <div class="mt-4 flex justify-end border-t border-zinc-200 pt-4">
      <Button
        :disabled="!meta.dirty || isPending"
        class="relative font-semibold"
      >
        <LoaderIcon
          v-if="isPending"
          class="absolute mx-auto size-5 animate-spin stroke-[1.5]"
        />
        <span :class="isPending ? 'invisible' : ''">Edit commet</span>
      </Button>
    </div>
  </form>
</template>
