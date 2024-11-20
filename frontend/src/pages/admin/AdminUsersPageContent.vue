<script setup lang="ts">
import NewReleasesIcon from "@/assets/icons/new-releases.svg?component";
import RejectIcon from "@/assets/icons/reject.svg?component";
import AppLayout from "@/layouts/AppLayout.vue";
import { adminUsersPageQuery } from "@/services/admin.service";
import { useQuery } from "@tanstack/vue-query";
import { ref, computed } from "vue";
import { Button } from "@/components/ui/button/";
import { AvatarRoot, AvatarImage, AvatarFallback } from "radix-vue";
import {
  Pagination,
  PaginationList,
  PaginationEllipsis,
  PaginationListItem,
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrev,
} from "@/components/ui/pagination";
import { getCDNImageURL } from "@/utils";
import { formatFullDateTime } from "@/utils/dayjs";

const pageSize = ref(10);
const page = ref(1);

const { data: userPage } = useQuery(
  computed(() =>
    adminUsersPageQuery({ pageSize: pageSize.value, page: page.value })
  )
);
</script>
<template>
  <AppLayout>
    <section class="relative mt-6 px-3 md:px-10">
      <div class="container flex w-auto flex-col gap-6">
        <div class="flex items-center gap-1.5">
          <h2 class="text-2xl font-semibold text-zinc-500">Users</h2>
          <span v-if="userPage" class="font-semibold text-zinc-500 text-xl">
            ({{ userPage?.totalItems }})</span
          >
        </div>

        <div class="overflow-x-auto">
          <table class="relative w-full min-w-full">
            <thead>
              <tr class="bg-zinc-50">
                <th
                  class="px-4 py-3 text-left text-sm font-semibold text-zinc-500"
                >
                  Avatar
                </th>
                <th
                  class="px-4 py-3 text-left text-sm font-semibold text-zinc-500"
                >
                  Name
                </th>
                <th
                  class="px-4 py-3 text-left text-sm font-semibold text-zinc-500"
                >
                  Email
                </th>
                <th
                  class="px-4 py-3 text-left text-sm font-semibold text-zinc-500"
                >
                  Verified
                </th>
                <th
                  class="px-4 py-3 text-right text-sm font-semibold text-zinc-500"
                >
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in userPage?.items"
                :key="user.id"
                class="border-t border-zinc-100"
              >
                <td class="px-4 py-3">
                  <div class="flex flex-col gap-1">
                    <AvatarRoot
                      class="block size-10 select-none overflow-hidden rounded-full"
                    >
                      <AvatarImage
                        class="size-full object-cover"
                        v-if="user.avatarKey"
                        :src="getCDNImageURL(user.avatarKey)"
                        height="40"
                        width="40"
                      />
                      <AvatarFallback class="block size-full">
                        <img
                          height="40"
                          width="40"
                          src="/images/placeholder_image.webp"
                        />
                      </AvatarFallback>
                    </AvatarRoot>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex flex-col gap-1">
                    <a :href="`/admin/users/${user.id}`">
                      <span
                        class="text-sm font-bold text-zinc-900 underline-offset-2 hover:underline md:text-sm"
                      >
                        {{ user.username }}
                      </span>
                    </a>
                  </div>
                </td>

                <td class="px-4 py-3">
                  <div class="flex flex-col gap-1">
                    <span class="inline-flex text-sm font-bold text-zinc-500">{{
                      user.email
                    }}</span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span
                    class="whitespace-nowrap text-sm font-bold text-zinc-500"
                  >
                    <RejectIcon
                      v-if="user.emailVerified === false"
                      class="size-5 stroke-[2] text-red-500"
                    />

                    <NewReleasesIcon
                      v-if="user.emailVerified === true"
                      class="size-5 stroke-[2] text-green-500"
                    />
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    class="whitespace-nowrap text-sm font-bold text-zinc-500"
                  >
                    {{ formatFullDateTime(user.createdAt) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex items-center justify-between text-center">
            <Pagination
              v-slot="{ page }"
              :items-per-page="pageSize"
              :total="userPage?.totalItems"
              :sibling-count="1"
              show-edges
              v-model:page="page"
            >
              <PaginationList
                v-slot="{ items }"
                class="flex items-center gap-1"
              >
                <PaginationFirst />
                <PaginationPrev />

                <template v-for="(item, index) in items">
                  <PaginationListItem
                    v-if="item.type === 'page'"
                    :key="index"
                    :value="item.value"
                    as-child
                  >
                    <Button
                      class="size-10 p-0"
                      :variant="item.value === page ? 'primary' : 'secondary'"
                    >
                      {{ item.value }}
                    </Button>
                  </PaginationListItem>
                  <PaginationEllipsis v-else :key="item.type" :index="index" />
                </template>

                <PaginationNext />
                <PaginationLast />
              </PaginationList>
            </Pagination>
            <span class="text-sm text-zinc-500"
              >Page {{ userPage?.currentPage }} of
              {{ userPage?.lastPage }}</span
            >
          </div>
        </div>
      </div>
    </section>
  </AppLayout>
</template>
