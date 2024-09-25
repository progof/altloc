<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import GameControllerIcon from "@/assets/icons/game-controller.svg?component";
import CommentIcon from "@/assets/icons/comment.svg?component";
import ScalesIcon from "@/assets/icons/scales.svg?component";
import SettingsIcon from "@/assets/icons/settings.svg?component";
import LogoutIcon from "@/assets/icons/logout.svg?component";
import LoaderIcon from "@/assets/icons/loader.svg?component";
import { getMeQueryOptions } from "@/services/user.service";
import { computed } from "vue";
import type { User } from "@shared/index";
import { useQueryClient } from "@tanstack/vue-query";
import { getCDNImageURL } from "@/utils";

import { useRouter } from "vue-router";
import { useLogoutMutation } from "@/services/auth.password.service";

const props = defineProps<{ user: User }>();

const queryClient = useQueryClient();
queryClient.setQueryData(getMeQueryOptions.queryKey, props.user);

const router = useRouter();
const { mutate: logout, isPending } = useLogoutMutation();

const logoutUser = () => {
  logout(undefined, {
    onSuccess: () => {
      router.push("/");
    },
  });
};

const avatar = computed(() => {
  return props.user.avatarKey
    ? getCDNImageURL(props.user.avatarKey)
    : "/images/placeholder_image.webp";
});
</script>

<template>
  <DropdownMenu :modal="false">
    <DropdownMenuTrigger class="flex items-center gap-2.5">
      <span class="hidden text-sm font-semibold md:block">
        {{ user.username }}
      </span>
      <img
        alt="User avatar"
        :src="avatar"
        class="size-10 shrink-0 rounded-full border border-black/10 transition-colors group-hover:border-black/20"
      />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="min-w-48">
      <DropdownMenuLabel>
        <div class="flex flex-col">
          <span>{{ user.username }}</span>
          <span class="text-xs font-normal text-zinc-600">
            {{ user.email }}
          </span>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem as="a" href="/user/day-quest">
          <GameControllerIcon class="mr-2 size-4 stroke-[1.5] text-zinc-800" />
          <span>Quests</span>
        </DropdownMenuItem>
        <DropdownMenuItem as="a" href="/user/day-comment">
          <CommentIcon class="mr-2 size-4 stroke-[1.5] text-zinc-800" />
          <span>Comments</span>
        </DropdownMenuItem>
        <DropdownMenuItem as="a" href="/user/day-balance" disabled>
          <ScalesIcon class="mr-2 size-4 stroke-[1.5] text-zinc-800" />
          <span>Balances</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem as="a" href="/user/settings" disabled>
          <SettingsIcon class="mr-2 size-4 stroke-[1.5] text-zinc-800" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem @select.prevent="logoutUser()">
          <LoaderIcon
            class="mr-2 size-4 animate-spin stroke-[1.5]"
            v-if="isPending"
          />
          <LogoutIcon v-else class="mr-2 size-4 stroke-[1.5] text-zinc-800" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
