<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm, Field } from "vee-validate";
import TextField from "@/components/ui/input/TextField.vue";
import Button from "@/components/ui/button/Button.vue";
import LoaderIcon from "@/assets/icons/loader.svg?component";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  useCreateTaskMutation,
  createTaskBodySchema,
  TASK_DIFFICULTY,
  TASK_PRIORITY,
} from "@/services/dayquest/task.service";
import { FetchError } from "@/utils/fetch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const { handleSubmit, meta, setFieldError } = useForm({
  validationSchema: toTypedSchema(createTaskBodySchema),
  validateOnMount: false,
});

const emit = defineEmits<{ close: [] }>();

const props = defineProps<{
  categoryId: string;
}>();

const { mutate: createTask, isPending } = useCreateTaskMutation();

console.log(TASK_DIFFICULTY.EASY);

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
      Create a task for the selected category that you plan to complete daily.
      Specify the difficulty level and priority of the task to help the system
      better evaluate your progress and achievements.
    </DialogDescription>
    <form @submit.prevent="onSubmit" class="mt-4 flex flex-col">
      <div class="mb-4 flex flex-col gap-3">
        <TextField
          name="name"
          label="Name"
          placeholder="Read 5 pages in English"
          class="text-zinc-600"
        />

        <Field
          as="div"
          class="flex flex-col gap-1.5"
          name="priority"
          v-slot="{ field, errorMessage }"
        >
          <Label for="priority">Priority</Label>
          <Select
            :name="field.name"
            :model-value="field.value"
            @update:model-value="field['onUpdate:modelValue']"
          >
            <SelectTrigger :invalid="!!errorMessage">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem :value="TASK_PRIORITY.LOW">Low</SelectItem>
              <SelectItem :value="TASK_PRIORITY.MEDIUM">Medium</SelectItem>
              <SelectItem :value="TASK_PRIORITY.HIGH">High</SelectItem>
            </SelectContent>
          </Select>
          <span v-if="errorMessage" class="text-xs font-medium text-red-600">
            {{ errorMessage }}
          </span>
        </Field>
        <Field
          as="div"
          class="flex flex-col gap-1.5"
          name="difficulty"
          v-slot="{ field, errorMessage }"
        >
          <Label for="difficulty">Difficulty</Label>
          <Select
            :name="field.name"
            :model-value="field.value"
            @update:model-value="field['onUpdate:modelValue']"
          >
            <SelectTrigger :invalid="!!errorMessage">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem :value="TASK_DIFFICULTY.EASY">Easy</SelectItem>
              <SelectItem :value="TASK_DIFFICULTY.MEDIUM">Medium</SelectItem>
              <SelectItem :value="TASK_DIFFICULTY.HARD">Hard</SelectItem>
            </SelectContent>
          </Select>
          <span v-if="errorMessage" class="text-xs font-medium text-red-600">
            {{ errorMessage }}
          </span>
        </Field>
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
