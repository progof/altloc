<script setup lang="ts">
import { z } from "zod";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useCreateCategoryMutation } from "@/services/dayquest/category.service";
import { TextField } from "@/components/ui/input";
// import { TasksTable } from "@/components/tasks-table";
import LoaderIcon from "@/assets/icons/loader.svg?component";
import { Button } from "@/components/ui/button";
// import DayQuestImageUpload from "./DayQuestImageUpload.vue";
import { FetchError } from "@/utils/fetch";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

const { handleSubmit, meta, setFieldError } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().min(6).max(32),
    })
  ),
});

defineEmits<{ close: [] }>();

const { mutate: createCategory, isPending } = useCreateCategoryMutation();

const onSubmit = handleSubmit((data) => {
  const { ...rest } = data;
  console.log("Create dayQuest -> data:", data);
  createCategory(
    {
      ...rest,
    },
    {
      onSuccess: () => {
        location.assign("/user/day-quest");
      },
      onError: async (error) => {
        if (error instanceof FetchError) {
          setFieldError("name", error.message);
        }
      },
    }
  );
});
</script>

<template>
  <DialogTitle class="text-xl font-bold tracking-tight"> DayQuest </DialogTitle>
  <DialogDescription class="mt-2 text-sm text-zinc-600">
    Create a new category for your dayQuest
  </DialogDescription>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-3 mt-2">
    <TextField
      name="name"
      label="Name"
      placeholder="Business"
      class="text-zinc-700"
    />

    <div class="mt-4 flex justify-end border-zinc-200 pt-4">
      <Button
        :disabled="!meta.dirty || isPending"
        class="relative font-semibold"
      >
        <LoaderIcon
          v-if="isPending"
          class="absolute mx-auto size-5 animate-spin stroke-[1.5]"
        />
        <span :class="isPending ? 'invisible' : ''">Create category</span>
      </Button>
    </div>
  </form>
</template>
