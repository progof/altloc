<script setup lang="ts">
import { z } from "zod";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  categoriesQuery,
  useUpdateCategoryMutation,
} from "@/services/dayquest/category.service";
import { TextField } from "@/components/ui/input";
import LoaderIcon from "@/assets/icons/loader.svg?component";
import { Button } from "@/components/ui/button";
import { FetchError } from "@/utils/fetch";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/vue-query";
import { watch } from "vue";

const props = defineProps<{
  categoryId: string;
}>();

const { handleSubmit, meta, setFieldError, resetForm } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().min(6).max(32),
    })
  ),
});

const { data: categories } = useQuery(categoriesQuery);
console.log("categories:", categories);
watch(
  categories,
  () => {
    const category = categories.value?.find(
      (category) => category.id === props.categoryId
    );
    console.log("category:", category);
    if (category) {
      resetForm({
        values: {
          name: category.name,
        },
      });
    }
  },
  {
    immediate: true,
  }
);

const emit = defineEmits<{ close: [] }>();

const { mutate: updateCategory, isPending } = useUpdateCategoryMutation();

const onSubmit = handleSubmit((data) => {
  // const formData = {
  //   ...data,
  //   categoryId: props.categoryId,
  // };
  console.log("Create dayQuest -> data:", data);
  updateCategory(
    {
      categoryId: props.categoryId,
      body: data,
    },
    {
      onSuccess: () => {
        // location.assign("/user/day-quest");
        emit("close");
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
  <DialogTitle class="text-xl font-bold tracking-tight">Edit</DialogTitle>
  <DialogDescription class="mt-2 text-sm text-zinc-600">
    Edit the category
  </DialogDescription>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-3 mt-2">
    <TextField
      name="name"
      label="Name"
      placeholder="Business"
      class="text-zinc-600"
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
        <span :class="isPending ? 'invisible' : ''">Edit category</span>
      </Button>
    </div>
  </form>
</template>
