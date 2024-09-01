<script setup lang="ts">
import { z } from "zod";
import { ErrorMessage, Field, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useCreateCategoryMutation } from "@/services/dayquest/category.service";
import { TextField } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TasksTable } from "@/components/tasks-table";
import LoaderIcon from "@/assets/icons/loader.svg?component";
import { Button } from "@/components/ui/button";
// import DayQuestImageUpload from "./DayQuestImageUpload.vue";
import { FetchError } from "@/utils/fetch";
import { DialogTitle } from "@/components/ui/dialog";
import { Id } from "@/components/ui/id";

const { handleSubmit, meta, values, setFieldError } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().min(6).max(256),
      // image: z
      //   .instanceof(File, { message: "The image is required" })
      //   .refine((file) => file.size < 5 * 1024 * 1024, {
      //     message: "The image is too large, max size is 5 MB",
      //   })
      //   .refine((file) => file.type.startsWith("image/"), {
      //     message: "The file must be an image",
      //   }),
      taskIds: z.array(z.string().uuid()).min(1),
    })
  ),
  initialValues: {
    taskIds: [],
  },
});

const emit = defineEmits<{ close: [] }>();

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
        location.assign("/dashboard");
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
  <DialogTitle class="mb-4 text-xl font-bold tracking-tight">
    Create dayQuest
  </DialogTitle>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-3">
    <TextField name="name" label="Name" />

    <!-- <div class="flex flex-col items-start gap-1.5">
      <Field name="image" v-slot="{ field }">
        <Id v-slot="{ id }">
          <Label :for="id">Image</Label>
          <DayQuestImageUpload
            :id="id"
            :name="field.name"
            :model-value="field.value"
            @update:model-value="field['onUpdate:modelValue']"
          />
        </Id>
      </Field>
    </div> -->

    <TasksTable name="taskIds" />

    <div class="mt-4 flex justify-end border-t border-zinc-200 pt-4">
      <Button
        :disabled="!meta.dirty || isPending"
        class="relative font-semibold"
      >
        <LoaderIcon
          v-if="isPending"
          class="absolute mx-auto size-5 animate-spin stroke-[1.5]"
        />
        <span :class="isPending ? 'invisible' : ''">Create dayQuest</span>
      </Button>
    </div>
  </form>
</template>
