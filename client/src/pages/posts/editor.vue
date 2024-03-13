<script setup lang="ts">
import { ref, watch } from "vue";
import { z } from "zod";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import {
  getPostQueryOptions,
  useUpdatePostMutation,
} from "@/services/post.service";
import { getMeQueryOptions } from "@/services/auth.service";
import MyButton from "@/components/UI/MyButton.vue";
import { QuillEditor } from "@vueup/vue-quill";
import "quill/dist/quill.snow.css";
import { marked } from "marked";
import SideBarNav from "@/components/SideBarNav.vue";

const route = useRoute();
const $router = useRouter();
const postId: string = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;
const { data: me } = useQuery(getMeQueryOptions);
const { data: postData } = useQuery(getPostQueryOptions(postId));
const userId = me.value?.user_id || "";

// const convertToMarkdown = (html: string) => {
// 	return marked(html);
// };

const quillOptions = ref({
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["clean"],
      ["link", "image"],
    ],
  },
  formats: [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "script",
    "indent",
    "direction",
    "color",
    "background",
    "link",
    "image",
    "video",
    "align",
  ],
  theme: "snow",
});

const postBodyContent = ref<string>(postData.value?.content || "");
console.log("Debig CoteBodyContent.value", postBodyContent.value);

const convertToMarkdown = (html: string) => {
  if (postBodyContent.value) {
    return marked(html);
  }
  return ""; // or handle the case where data is not loaded
};

const validationSchema = z.object({
  title: z.string().refine((value) => value.trim() !== "", {
    message: "Title is required",
  }),
  // body: z.string().refine(
  // 	(value) => {
  // 		if (typeof value === "string") {
  // 			return value.trim() !== "";
  // 		}
  // 		return false;
  // 	},
  // 	{
  // 		message: "Body is required",
  // 	}
  // ),
});

const validationErrors = ref<{
  title?: string;
  content?: string;
}>({});

watch(postData, () => {
  if (!postData.value) return;
  content.value = postData.value.content;
});

const content = ref("");

const { mutate: postUpdate, isPending, error } = useUpdatePostMutation();

const updateNote = async (event: Event) => {
  const rawData = Object.fromEntries(
    new FormData(event.target as HTMLFormElement)
  );
  console.log("rawData", rawData);

  const result = validationSchema.safeParse(rawData);
  rawData.body = convertToMarkdown(postData.value?.content || "");
  // rawData.body = noteData.value?.body || '';

  console.log("Validation result:", result);
  if (!result.success) {
    console.log("Validation failed:", result.error);
    const error = result.error;
    validationErrors.value.title = error.issues.find(
      (issue) => issue.path[0] === "post_title"
    )?.message;
    return;
  }
  validationErrors.value = {};

  console.log("Data to be sent:", result.data);
  postUpdate(
    {
      postId: postId,
      userId: userId,
      title: result.data.title,
      content: content.value,
    },
    {
      onError: (err) => {
        console.error("Error updating post:", err);
      },
    }
  );

  $router.push(`/dashboard`);
};
</script>

<template>
  <SideBarNav />
  <div class="edit-section">
    <div v-if="postData" class="post">
      <form @submit.prevent="updateNote">
        <div class="form-group">
          <label for="title">Title:</label>
          <input
            :value="postData.title"
            type="text"
            id="title"
            name="title"
            required
          />
          <span v-if="validationErrors.title">{{
            validationErrors.title
          }}</span>
        </div>

        <div class="form-group">
          <label for="content">Content:</label>
          <!-- <textarea v-model="noteData.body" id="note_body"  name="note_body" required></textarea> -->
          <QuillEditor
            v-model:content="content"
            theme="snow"
            id="contetn"
            :options="quillOptions"
            contentType="html"
          />
          <span v-if="validationErrors.content">{{
            validationErrors.content
          }}</span>
        </div>

        <div class="form-group">
          <MyButton type="submit" :disabled="isPending">
            {{ isPending ? "Fetching..." : "Save post" }}
          </MyButton>
        </div>
      </form>
    </div>

    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<style scoped>
.edit-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background-color: rgb(15, 14, 14);
  color: azure;
  height: 100vh;
}

h3 {
  color: teal;
  padding-bottom: 10px;
}

.post-description p,
.post-content p,
.post-category p,
.post-created_at p,
.post-author p,
.postID p {
  margin-bottom: 10px;
}

.post-description,
.post-content,
.post-category,
.post-created_at,
.post-author,
.postID {
  margin-top: 20px;
}

.postID p {
  font-weight: bold;
}

/* Additional styles for MyButton component */
.post-button {
  margin-top: 20px;
}
.post-header h3 {
  color: teal;
  margin-bottom: 15px;
}

.post-info {
  margin-top: 20px;
}

.post-info p {
  margin-bottom: 10px;
}

.post-info p strong {
  margin-right: 5px;
}
</style>
