<script setup lang="ts">
import {
  FileUpload,
  FileUploadDropZone,
  FileUploadHiddenInput,
  FileUploadItem,
  FileUploadTrigger,
  FileUploadItemImagePreview,
  FileUploadItemDeleteTrigger,
} from "@/components/ui/file-upload";
import { AvatarRoot, AvatarImage, AvatarFallback } from "radix-vue";
import UploadCloudIcon from "@/assets/icons/upload-cloud.svg?component";
import CloseIcon from "@/assets/icons/close.svg?component";
import prettyBytes from "pretty-bytes";
import { useFieldError } from "vee-validate";

const props = defineProps<{
  id: string;
  name: string;
}>();

const errorMessage = useFieldError(() => props.name);

const value = defineModel<File | undefined>({
  default: undefined,
  required: true,
});
</script>

<template>
  <FileUpload
    as="div"
    class="flex w-full flex-col gap-4"
    :model-value="value ? [value] : undefined"
    @update:model-value="(files) => (value = files[0])"
    v-slot="{ file }"
  >
    <FileUploadDropZone class="group">
      <FileUploadItem
        v-if="file"
        :file="file"
        :key="file.name"
        class="flex w-full flex-col divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200"
      >
        <div
          class="flex h-32 w-full shrink-0 items-center justify-center bg-zinc-50 p-3"
        >
          <FileUploadItemImagePreview v-slot="{ url }">
            <AvatarRoot
              class="block h-full shrink-0 select-none overflow-hidden"
            >
              <AvatarImage
                v-if="url"
                :src="url"
                class="mx-auto aspect-video h-full object-cover"
              />
              <AvatarFallback class="block h-full animate-pulse bg-zinc-300" />
            </AvatarRoot>
          </FileUploadItemImagePreview>
        </div>
        <div class="flex items-center gap-3 p-3">
          <div class="flex min-w-0 flex-1 flex-col">
            <span class="truncate text-sm font-medium">
              {{ file.name }}
            </span>
            <span v-if="errorMessage" class="mt-0.5 text-xs text-red-400">
              {{ errorMessage }}
            </span>
            <span v-else class="mt-0.5 text-xs text-zinc-500">
              {{ prettyBytes(file.size) }}
            </span>
          </div>
          <FileUploadItemDeleteTrigger
            class="flex rounded p-1 outline-none ring-white/15 transition-colors hover:bg-zinc-100 focus-visible:ring-2 disabled:opacity-50"
          >
            <CloseIcon
              aria-hidden
              class="size-[18px] shrink-0 stroke-[1.5] text-zinc-500"
            />
          </FileUploadItemDeleteTrigger>
        </div>
      </FileUploadItem>
      <div
        v-else
        class="flex w-full flex-col items-center rounded-xl border border-dashed border-zinc-200 px-6 py-6 text-center transition-colors group-data-[drag-over=true]:border-indigo-300 group-data-[drag-over=true]:bg-indigo-50"
      >
        <UploadCloudIcon
          class="mb-3 mt-0.5 size-5 rounded-full bg-white stroke-[1.5] text-zinc-400 ring-2 ring-zinc-50 ring-offset-8 ring-offset-white"
        />
        <span>
          <FileUploadTrigger
            class="mr-1 whitespace-nowrap rounded text-sm font-semibold leading-5 outline-none ring-white/25 hover:underline focus-visible:ring-2"
          >
            Click to upload
          </FileUploadTrigger>
          <span class="text-sm text-zinc-500">or drag and drop</span>
        </span>
        <span v-if="errorMessage" class="mt-0.5 text-xs text-red-500">
          {{ errorMessage }}
        </span>
        <span v-else class="mt-0.5 text-xs text-zinc-500">
          Recommended size: 1600x900 pixels; Accepted formats: JPG, PNG, WEBP
        </span>
      </div>
    </FileUploadDropZone>
    <FileUploadHiddenInput
      :id="props.id"
      :name="props.name"
      :accept="['image/jpeg', 'image/png', 'image/webp'].join(', ')"
    />
  </FileUpload>
</template>
