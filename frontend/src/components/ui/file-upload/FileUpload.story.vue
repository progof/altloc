<script setup lang="ts">
import {
	FileUpload,
	FileUploadDropZone,
	FileUploadHiddenInput,
	FileUploadItem,
	FileUploadItemDeleteTrigger,
	FileUploadItemGroup,
	FileUploadTrigger,
	FileUploadItemImagePreview,
} from ".";
import UploadCloudIcon from "@/icons/upload-cloud.svg?component";
import CloseIcon from "@/icons/close.svg?component";
import prettyBytes from "pretty-bytes";
import { AvatarFallback, AvatarImage, AvatarRoot } from "radix-vue";
import EditIcon from "@/icons/edit.svg?component";
</script>

<template>
	<Story title="FileUpload">
		<Variant title="Multiple">
			<div class="p-8">
				<FileUpload as="div" class="flex flex-col gap-4">
					<FileUploadDropZone
						class="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-6 py-4 text-center transition-colors hover:bg-stone-800 data-[drag-over=true]:border-stone-400/75 data-[drag-over=true]:bg-stone-800"
					>
						<div
							class="mb-3 rounded-lg p-2.5 shadow-md shadow-white/5 ring-1 ring-white/15"
							aria-hidden
						>
							<UploadCloudIcon class="size-5 stroke-[1.5] text-white/50" />
						</div>
						<span>
							<FileUploadTrigger
								class="mr-1 whitespace-nowrap rounded text-sm font-semibold leading-5 text-white outline-none ring-white/25 hover:underline focus-visible:ring-2"
							>
								Click to upload
							</FileUploadTrigger>
							<span class="text-sm text-white/75">or drag and drop</span>
						</span>
						<span class="mt-1 text-xs text-white/50">
							File should be less than 10MB
						</span>
					</FileUploadDropZone>
					<FileUploadItemGroup v-slot="{ files }" class="flex flex-col gap-3">
						<FileUploadItem
							v-for="file in files"
							:file="file"
							:key="file.name"
							class="flex w-full items-center gap-x-3 rounded-lg bg-stone-700 p-3"
						>
							<FileUploadItemImagePreview v-slot="{ url }">
								<AvatarRoot
									class="block size-10 shrink-0 select-none overflow-hidden rounded"
								>
									<AvatarImage
										v-if="url"
										:src="url"
										height="40"
										width="40"
										class="size-full object-cover"
									/>
									<AvatarFallback
										class="block size-full animate-pulse bg-white/10"
									/>
								</AvatarRoot>
							</FileUploadItemImagePreview>
							<div class="flex flex-1 flex-col">
								<span class="truncate text-sm font-medium">
									{{ file.name }}
								</span>
								<span class="mt-0.5 truncate text-xs text-white/75">
									{{ prettyBytes(file.size) }}
								</span>
							</div>
							<FileUploadItemDeleteTrigger
								class="flex rounded p-1 outline-none ring-white/15 transition-colors hover:bg-white/10 focus-visible:ring-2"
							>
								<CloseIcon
									aria-hidden
									class="size-[18px] shrink-0 stroke-[1.5] text-white/50"
								/>
							</FileUploadItemDeleteTrigger>
						</FileUploadItem>
					</FileUploadItemGroup>
					<FileUploadHiddenInput multiple accept="image/*" />
				</FileUpload>
			</div>
		</Variant>
		<Variant title="Single with default">
			<div class="p-8">
				<FileUpload v-slot="{ file }">
					<FileUploadDropZone as-child>
						<FileUploadTrigger
							class="group relative flex size-32 overflow-hidden rounded-3xl shadow-lg"
						>
							<div
								class="absolute left-0 right-0 flex h-full items-center justify-center rounded-3xl bg-black/50 opacity-0 ring-1 ring-inset ring-white/5 backdrop-blur-sm transition-opacity duration-100 ease-out-quad group-hover:opacity-100 group-data-[drag-over=true]:opacity-100"
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
									src="https://cdn.imgchest.com/files/g4z9c8qzbv7.png"
								/>
								<AvatarFallback
									class="block size-full animate-pulse bg-white/10"
								/>
							</AvatarRoot>
						</FileUploadTrigger>
					</FileUploadDropZone>
					<FileUploadHiddenInput accept="image/*" />
				</FileUpload>
			</div>
		</Variant>
	</Story>
</template>
