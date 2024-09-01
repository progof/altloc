<script setup lang="ts">
import { DialogTitle } from "@/components/ui/dialog";
import { TextField } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <DialogTitle class="mb-4 text-xl font-bold tracking-tight">
    Set conference verification
  </DialogTitle>

  <form class="flex flex-col">
    <div class="flex flex-col gap-3">
      <TextField label="Comment" name="comment" />
    </div>

    <Button type="submit" class="mt-4"> Create task </Button>
  </form>
</template>
