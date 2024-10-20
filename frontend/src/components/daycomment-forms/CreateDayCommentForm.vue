<script setup lang="ts">
import { z } from "zod";
import { useForm, Field } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  useCreateCommentMutation,
  EMOTIONAL_STATE,
} from "@/services/dayquest/comment.service";
import { TextArea } from "@/components/ui/text-area";
import LoaderIcon from "@/assets/icons/loader.svg?component";
import { Button } from "@/components/ui/button";
import { FetchError } from "@/utils/fetch";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
// import TextField from "../ui/input/TextField.vue";

const { handleSubmit, meta, setFieldError } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      description: z.string().min(1).max(256),
      emotionalState: z.enum([
        "VEVY_BAD",
        "BAD",
        "NEUTRAL",
        "GOOD",
        "VERY_GOOD",
      ]),
    })
  ),
});

defineEmits<{ close: [] }>();

const { mutate: createComment, isPending } = useCreateCommentMutation();

const onSubmit = handleSubmit((data) => {
  console.log("Create dayComment -> data:", data);
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
          setFieldError("emotionalState", error.message);
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
    <TextArea
      name="description"
      label="Description"
      placeholder="Cool day..."
    />

    <!-- <TextField name="emotionalState" label="Emotional State" type="number" /> -->
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
        type="submit"
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
