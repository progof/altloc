<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import TextField from "@/components/ui/input/TextField.vue";
import Button from "@/components/ui/button/Button.vue";
import LoaderIcon from "@/assets/icons/loader.svg?component";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  useCreateTaskMutation,
  createTaskBodySchema,
} from "@/services/dayquest/task.service";
import { FetchError } from "@/utils/fetch";

const { handleSubmit, meta, setFieldError } = useForm({
  validationSchema: toTypedSchema(createTaskBodySchema),
});

const emit = defineEmits<{ close: [] }>();

const props = defineProps<{
  categoryId: string;
}>();

const { mutate: createTask, isPending } = useCreateTaskMutation();

const onSubmit = handleSubmit((data) => {
  const formData = {
    ...data,
    categoryId: props.categoryId,
  };
  console.log("Create dayQuest -> data:", data);
  createTask(
    formData,

    {
      onSuccess: () => {
        emit("close");
      },
      onError: async (error) => {
        if (error instanceof FetchError) {
          const body = (await error.response.json()) as {
            errors: { message: string }[];
          };
          setFieldError("name", body.errors[0].message);
        }
      },
    }
  );
});
</script>

<template>
  <div class="flex flex-col">
    <DialogTitle class="text-xl font-bold tracking-tight">
      Create task
    </DialogTitle>
    <DialogDescription class="mt-2 text-sm text-zinc-600">
      Create a new task to complete
    </DialogDescription>
    <form @submit.prevent="onSubmit" class="mt-4 flex flex-col">
      <div class="mb-4 flex flex-col gap-3">
        <TextField
          name="name"
          label="Name"
          placeholder="Make eat"
          class="text-zinc-600"
        />
      </div>
      <Button
        type="submit"
        :disabled="isPending || (!meta.touched && !meta.valid)"
      >
        <LoaderIcon v-if="isPending" class="size-4 animate-spin stroke-[1.5]" />
        Create task
      </Button>
    </form>
  </div>
</template>
