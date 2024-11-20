<script setup lang="ts">
import AppLayout from "@/layouts/AppLayout.vue";
import { useQuery } from "@tanstack/vue-query";
import { useRoute } from "vue-router";
import { adminUserByIdQuery } from "@/services/admin.service";
import { getCDNImageURL } from "@/utils";
import { formatFullDateTime } from "@/utils/dayjs";
import NewReleasesIcon from "@/assets/icons/new-releases.svg?component";
import RejectIcon from "@/assets/icons/reject.svg?component";
import ChevronLeftIcon from "@/assets/icons/arrowLeft.svg?component";

const route = useRoute();
const userId: string = Array.isArray(route.params.userId)
  ? route.params.userId[0]
  : route.params.userId;

const { data: user } = useQuery({
  ...adminUserByIdQuery(userId),
  enabled: !!userId,
});
</script>

<template>
  <AppLayout>
    <section class="relative mt-6 px-3 md:px-10">
      <div class="container flex w-auto flex-col gap-6">
        <div class="flex flex-col gap-6">
          <div class="flex w-full flex-col gap-3" v-if="user">
            <div class="flex gap-3 items-center">
              <a
                href="/admin/users"
                class="text-zinc-600 bg-zinc-200 hover:bg-zinc-300 p-2 rounded-full flex items-center justify-center"
              >
                <ChevronLeftIcon class="size-5 stroke-[2] ml-1" />
              </a>
              <h3 class="text-2xl font-medium text-zinc-500">User profile</h3>
            </div>
            <div
              class="flex items-center gap-3 border-t-2 border-zinc-200 pt-6"
            >
              <div class="flex flex-col gap-3">
                <img
                  v-if="user.avatarKey"
                  alt="User avatar"
                  :src="
                    user.avatarKey
                      ? getCDNImageURL(user.avatarKey)
                      : '/images/placeholder_image.webp'
                  "
                  class="size-40 shrink-0 rounded-full border border-black/10 transition-colors group-hover:border-black/20"
                />
              </div>

              <div class="flex flex-col gap-3">
                <p class="text-sm font-medium text-zinc-400">
                  Name:
                  <span class="text-zinc-600">
                    {{ user.username }}
                  </span>
                </p>

                <p class="text-sm font-medium text-zinc-400">
                  Email:
                  <span class="text-zinc-600">
                    {{ user.email }}
                  </span>
                </p>
                <p
                  class="flex items-center gap-1 text-sm font-medium text-zinc-400"
                >
                  Verified:
                  <span class="text-zinc-600">
                    <NewReleasesIcon
                      v-if="!user.verified"
                      class="w-4 h-4 text-green-500"
                    />
                    <RejectIcon v-else class="w-4 h-4 text-red-500" />
                  </span>
                </p>
                <p class="text-sm font-medium text-zinc-400">
                  Created at:
                  <span class="text-zinc-600">
                    {{ formatFullDateTime(user.createdAt) }}
                  </span>
                </p>
                <p class="text-sm font-medium text-zinc-400">
                  Level:
                  <span class="text-zinc-600">
                    {{ user.level }}
                  </span>
                </p>
                <p class="text-sm font-medium text-zinc-400">
                  Currency:
                  <span class="text-zinc-600">
                    {{ user.currency }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- <div class="grid grid-cols-4 gap-6 border-t-2 border-zinc-200 pt-6">
					{
						userConfernces.map((userConfernce) => (
							<ConfsCard conference={userConfernce} client:load />
						))
					}
				</div> -->
        </div>
      </div>
    </section>
  </AppLayout>
</template>
