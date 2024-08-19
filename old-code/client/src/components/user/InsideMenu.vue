<script setup lang="ts">
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "radix-vue";

import NoteList from "@/components/note/NoteList.vue";
import PostList from "@/components/post/PostList.vue";
import SavedPostList from "@/components/post/SavedListToPost.vue";
import SavedNoteList from "@/components/note/SavedListToNote.vue";
</script>

<template>
  <TabsRoot
    class="flex flex-col flex-inline w-full bg-[rgba(15,14,14,0.5)]"
    default-value="tab1"
  >
    <TabsList
      class="relative shrink-0 flex border-b border-white"
      aria-label="Inside menu"
    >
      <TabsIndicator
        class="absolute px-8 left-0 h-[2px] bottom-0 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded-full transition-[width,transform] duration-300"
      >
        <div class="bg-grass8 w-full h-full" />
      </TabsIndicator>
      <TabsTrigger
        class="bg-[rgba(15,14,14,0.5)] px-5 h-[45px] flex-1 flex items-center justify-center text-sm leading-none text-mauve11 select-none rounded-tl-md hover:text-grass11 data-[state=active]:text-grass11 outline-none cursor-default focus-visible:relative focus-visible:shadow-[0_0_0_2px]"
        value="tab1"
      >
        My posts
      </TabsTrigger>
      <TabsTrigger
        class="bg-[rgba(15,14,14,0.5)] px-5 h-[45px] flex-1 flex items-center justify-center text-sm leading-none text-mauve11 select-none rounded-tr-md hover:text-grass11 data-[state=active]:text-grass11 outline-none cursor-default focus-visible:relative focus-visible:shadow-[0_0_0_2px]"
        value="tab2"
      >
        My notes
      </TabsTrigger>
      <TabsTrigger
        class="bg-[rgba(15,14,14,0.5)] px-5 h-[45px] flex-1 flex items-center justify-center text-sm leading-none text-mauve11 select-none rounded-tr-md hover:text-grass11 data-[state=active]:text-grass11 outline-none cursor-default focus-visible:relative focus-visible:shadow-[0_0_0_2px]"
        value="tab3"
      >
        Saved notes
      </TabsTrigger>
      <TabsTrigger
        class="bg-[rgba(15,14,14,0.5)] px-5 h-[45px] flex-1 flex items-center justify-center text-sm leading-none text-mauve11 select-none rounded-tr-md hover:text-grass11 data-[state=active]:text-grass11 outline-none cursor-default focus-visible:relative focus-visible:shadow-[0_0_0_2px]"
        value="tab4"
      >
        Saved posts
      </TabsTrigger>
    </TabsList>
    <TabsContent
      class="grow p-5 bg-[rgba(15,14,14,0.5)] rounded-b-md outline-none focus:shadow-[0_0_0_2px]"
      value="tab1"
    >
      <post-list style="overflow: scroll" />
    </TabsContent>
    <TabsContent
      class="grow p-5 bg-[rgba(15,14,14,0.5)] rounded-b-md outline-none focus:shadow-[0_0_0_2px]"
      value="tab2"
    >
      <note-list style="overflow: scroll" />
    </TabsContent>
    <TabsContent
      class="grow p-5 bg-[rgba(15,14,14,0.5)] rounded-b-md outline-none focus:shadow-[0_0_0_2px]"
      value="tab3"
    >
      <SavedPostList style="overflow: scroll" />
    </TabsContent>
    <TabsContent
      class="grow p-5 bg-[rgba(15,14,14,0.5)] rounded-b-md outline-none focus:shadow-[0_0_0_2px]"
      value="tab4"
    >
      <SavedNoteList style="overflow: scroll" />
    </TabsContent>
  </TabsRoot>
</template>
