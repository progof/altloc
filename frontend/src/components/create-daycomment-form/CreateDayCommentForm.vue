<script setup lang="ts">
import { z } from "zod";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useCreateCommentMutation } from "@/services/dayquest/comment.service";
import { TextField } from "@/components/ui/input";
import LoaderIcon from "@/assets/icons/loader.svg?component";
import { Button } from "@/components/ui/button";
import { FetchError } from "@/utils/fetch";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

const { handleSubmit, meta, setFieldError } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      description: z.string().min(1).max(256),
    })
  ),
});

const emit = defineEmits<{ close: [] }>();

const { mutate: createComment, isPending } = useCreateCommentMutation();

const onSubmit = handleSubmit((data) => {
  const { ...rest } = data;
  console.log("Create dayComment -> data:", data);
  createComment(
    {
      ...rest,
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
  <DialogTitle class="text-xl font-bold tracking-tight">
    DayComment
  </DialogTitle>
  <DialogDescription class="mt-2 text-sm text-zinc-600">
    Create a new comment for the day.
  </DialogDescription>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-3 mt-2">
    <TextField
      name="description"
      label="Description"
      placeholder="Cool day..."
    />

    <div class="mt-4 flex justify-end border-t border-zinc-200 pt-4">
      <Button
        :disabled="!meta.dirty || isPending"
        class="relative font-semibold"
      >
        <LoaderIcon
          v-if="isPending"
          class="absolute mx-auto size-5 animate-spin stroke-[1.5]"
        />
        <span :class="isPending ? 'invisible' : ''">Create comment</span>
      </Button>
    </div>
  </form>
</template>
