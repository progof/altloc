<script lang="ts">
export const FILE_UPLOAD_ITEM_CONTEXT = Symbol(
	"FILE_UPLOAD_ITEM_CONTEXT",
) as InjectionKey<{
	file: Readonly<Ref<File>>;
}>;
</script>

<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { provide, toRef, type InjectionKey, type Ref } from "vue";

const props = withDefaults(defineProps<PrimitiveProps & { file: File }>(), {
	as: "li",
});

provide(FILE_UPLOAD_ITEM_CONTEXT, {
	file: toRef(() => props.file),
});
</script>

<template>
	<Primitive :as="as" :as-child="asChild">
		<slot />
	</Primitive>
</template>
