<script setup lang="ts">
import { z } from "zod";
import { useForm, Field } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  useUpdateCommentMutation,
  commentsQuery,
  EMOTIONAL_STATE,
} from "@/services/dayquest/comment.service";
import { TextArea } from "@/components/ui/text-area";
import LoaderIcon from "@/assets/icons/loader.svg?component";
import { Button } from "@/components/ui/button";
import { FetchError } from "@/utils/fetch";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/vue-query";
import { watch } from "vue";
import { UserComment } from "@shared/index";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const props = defineProps<{
  comment: UserComment;
}>();

const { handleSubmit, meta, setFieldError, resetForm } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      description: z.string().min(1).max(256),
      emotionalState: z.enum([
        "VERY_BAD",
        "BAD",
        "NEUTRAL",
        "GOOD",
        "VERY_GOOD",
      ]),
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
          emotionalState:
            comment.emotionalState as keyof typeof EMOTIONAL_STATE,
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

    <Field
      as="div"
      class="flex flex-col gap-1.5"
      name="emotionalState"
      v-slot="{ field, errorMessage }"
    >
      <Label for="emotionalState">Emotional State</Label>
      <Select
        :name="field.name"
        :model-value="field.value"
        @update:model-value="field['onUpdate:modelValue']"
      >
        <SelectTrigger :invalid="!!errorMessage">
          <SelectValue placeholder="Rate from 1 to 10" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem :value="EMOTIONAL_STATE.BAD">Bad</SelectItem>
          <SelectItem :value="EMOTIONAL_STATE.GOOD">Good</SelectItem>
          <SelectItem :value="EMOTIONAL_STATE.NEUTRAL">Neutral</SelectItem>
          <SelectItem :value="EMOTIONAL_STATE.VERY_BAD">Very bad</SelectItem>
          <SelectItem :value="EMOTIONAL_STATE.VERY_GOOD">Very good</SelectItem>
        </SelectContent>
      </Select>
      <span v-if="errorMessage" class="text-xs font-medium text-red-600">
        {{ errorMessage }}
      </span>
    </Field>

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
