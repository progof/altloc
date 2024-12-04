<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/input";
import { Field, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  FileUpload,
  FileUploadItem,
  FileUploadDropZone,
  FileUploadTrigger,
  FileUploadHiddenInput,
  FileUploadItemImagePreview,
} from "@/components/ui/file-upload";
import { AvatarImage, AvatarRoot, AvatarFallback } from "radix-vue";
import { z } from "zod";
import { useQuery } from "@tanstack/vue-query";
import { watch } from "vue";
import EditIcon from "@/assets/icons/edit.svg?component";
import {
  getMeQueryOptions,
  useUpdateCurrentUserMutation,
} from "@/services/user.service";
import { getCDNImageURL, PLACEHOLDER_AVATAR } from "@/utils";
import AppLayout from "@/layouts/AppLayout.vue";

const { data: me } = useQuery(getMeQueryOptions);

const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      username: z.string().min(1).max(255),
      avatar: z
        .instanceof(File)
        .refine((file) => file.size < 4 * 1024 * 1024, {
          message: "The image is too large, max size is 4 MB",
        })
        .refine((file) => file.type.startsWith("image/"), {
          message: "The file must be an image",
        })
        .optional(),
    })
  ),
  validateOnMount: false,
});

watch(
  me,
  () => {
    if (me.value) {
      resetForm({
        values: {
          username: me.value.username,
        },
      });
    }
  },
  { immediate: true }
);

const { mutate: updateUser, isPending } = useUpdateCurrentUserMutation();

const onSubmit = handleSubmit((data) => {
  console.log("DATA for send: ", data);
  updateUser(data);
});
</script>

<template>
  <AppLayout>
    <section class="relative mt-6 px-3 md:px-10">
      <div class="container flex w-auto flex-col gap-6">
        <form
          class="flex w-auto flex-col gap-6 px-6 py-5"
          @submit.prevent="onSubmit"
        >
          <h3 class="text-2xl font-bold tracking-tight text-zinc-700">
            Edit account
          </h3>
          <div class="flex flex-col gap-6 md:flex-row">
            <Field
              name="avatar"
              class="l flex shrink-0 flex-col gap-6"
              v-slot="{ field }"
            >
              <FileUpload
                v-slot="{ file }"
                :model-value="field.value ? [field.value] : []"
                @update:model-value="
                  (files) => field['onUpdate:modelValue']?.(files[0])
                "
              >
                <FileUploadDropZone as-child>
                  <FileUploadTrigger
                    class="group relative flex size-24 shrink-0 overflow-hidden rounded-full shadow-lg"
                  >
                    <div
                      class="absolute left-0 right-0 flex h-full items-center justify-center rounded-3xl bg-black/50 opacity-0 ring-1 ring-inset ring-white/5 backdrop-blur-sm transition-opacity duration-100 ease-out group-hover:opacity-100 group-data-[drag-over=true]:opacity-100"
                    >
                      <EditIcon aria-hidden class="size-8 text-white/75" />
                    </div>
                    <AvatarRoot class="block size-full shrink-0 select-none">
                      <FileUploadItem
                        v-if="file"
                        :file="file"
                        as="div"
                        class="size-full"
                      >
                        <FileUploadItemImagePreview v-slot="{ url }">
                          <AvatarImage
                            v-if="url"
                            :src="url"
                            height="128"
                            width="128"
                            class="size-full object-cover"
                          />
                        </FileUploadItemImagePreview>
                      </FileUploadItem>
                      <AvatarImage
                        v-else
                        height="128"
                        width="128"
                        class="size-full object-cover"
                        :src="
                          me?.avatarKey
                            ? getCDNImageURL(me.avatarKey)
                            : PLACEHOLDER_AVATAR
                        "
                      />
                      <AvatarFallback
                        class="block size-full animate-pulse bg-zinc-200"
                      />
                    </AvatarRoot>
                  </FileUploadTrigger>
                </FileUploadDropZone>
                <FileUploadHiddenInput accept="image/*" />
              </FileUpload>
            </Field>
            <div class="flex flex-1 flex-col gap-3">
              <Field name="username" v-slot="{ field }">
                <TextField
                  label="Name"
                  :name="field.name"
                  class="text-zinc-700"
                />
              </Field>
            </div>
          </div>
          <div class="flex items-center justify-end gap-y-12">
            <Button
              type="submit"
              :disabled="(!meta.valid && meta.dirty) || isPending"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </section>
  </AppLayout>
</template>
