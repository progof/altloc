<script setup lang="ts">
import { ref, defineProps } from "vue";
import { z } from "zod";
import { useRouter } from "vue-router";
import { QuillEditor } from "@vueup/vue-quill";
import "quill/dist/quill.snow.css";
import {
  useCreateCommentNoteMutation,
  getCommentsForNoteQueryOptions,
} from "@/services/app.service";
import { useQuery } from "@tanstack/vue-query";
import MyButton from "@/components/UI/MyButton.vue";
import Modal from "@/components/Modal.vue";
import CommentIcon from "@/assets/icons/CommentIcon.svg?component";
import { marked } from "marked";

const modalActive = ref(false);

const toggleModal = () => {
  modalActive.value = !modalActive.value;
};

const props = defineProps<{ noteId: string }>();
const { data: comments } = useQuery(
  getCommentsForNoteQueryOptions(props.noteId)
);

console.log("comments post", comments.value?.comment);

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleString();
};

function htmlToFormattedText2(html: string) {
  let tempElement = document.createElement("div");
  tempElement.innerHTML = html;

  return tempElement.innerHTML;
}

const $router = useRouter();
const convertToMarkdown = (html: string) => {
  return marked(html);
};

const quillOptions = ref({
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ header: 1 }, { header: 2 }],
      ["clean"],
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

const commentBodyContent = ref<string>("");

// watch(commentBodyContent, () => console.log(commentBodyContent.value));

const validationSchema = z.object({
  comment: z.string().min(1),
});

const validationErrors = ref<{
  comment?: string;
}>({});

const {
  mutate: noteComment,
  isPending,
  error,
} = useCreateCommentNoteMutation();

const submitForm = async () => {
  const result = validationSchema.safeParse({
    comment: convertToMarkdown(commentBodyContent.value),
  });

  console.log("Validation result:", result);
  if (!result.success) {
    console.log("Validation failed:", result.error);
    const error = result.error;
    validationErrors.value.comment = error.issues.find(
      (issue) => issue.path[0] === "comment_post"
    )?.message;

    return;
  }
  validationErrors.value = {};

  console.log("Data to be sent:", result.data);

  noteComment(
    { noteId: props.noteId, comment: result.data.comment },
    {
      onError: (err) => {
        console.error("Error creating post:", err);
      },
    }
  );
  $router.push(`/feed`);
};
</script>

<template>
  <div>
    <button @click="toggleModal" class="button">
      <CommentIcon style="width: 24px; height: 24px" />
    </button>
  </div>
  <Modal @close="toggleModal" :modalActive="modalActive">
    <div class="dialog">
      <div class="dialog__content">
        <button @click="toggleModal" class="close-button">
          <CloseIcon style="width: 24px; height: 24px" />
        </button>
        <div class="container">
          <form @submit.prevent="submitForm">
            <div class="editor-container">
              <fieldset>
                <label for="comment_post">Comment:</label>
                <QuillEditor
                  v-model:content="commentBodyContent"
                  theme="snow"
                  id="comment_post"
                  placeholder="Description..."
                  :options="quillOptions"
                  content-type="html"
                />
                <span v-if="validationErrors.comment" class="error-message">
                  {{ validationErrors.comment }}
                </span>
              </fieldset>
            </div>
            <span v-if="error" class="error-message">{{ error }}</span>
            <MyButton type="submit" :disabled="isPending">
              {{ isPending ? "Fetching..." : "Create comment" }}
            </MyButton>
          </form>
        </div>
        <div class="comment-lists" v-if="comments">
          <ul v-if="comments.length > 0">
            <li v-for="comment in comments" :key="comment.note_id">
              <div class="comment-card">
                <div class="comment__avatar">
                  <MyButton
                    @click="$router.push(`/users/${comment.user_id}`)"
                    class="user-button"
                  >
                    {{ comment.username }}
                  </MyButton>
                </div>

                <span
                  class="comment-content"
                  v-html="htmlToFormattedText2(comment.comment)"
                ></span>
                <span class="created-at">
                  Created at: {{ formatCreatedAt(comment.created_at) }}
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div v-else>
          <p class="no-comments-message">No comments available.</p>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.container {
  max-width: 400px;
  width: 600px;
  margin: 0 auto;
  padding: 10px;
}

/* .dialog {
  width: 600px;
  height: 600px;
} */

.dialog__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;
  max-width: 600px;
  max-height: 500px;
}

.close-button {
  align-self: flex-end;
  margin-bottom: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.editor-container {
  margin-bottom: 20px;
  color: black;
}

.error-message {
  display: block;
  margin-top: 5px;
  color: red;
}

.comment-lists {
  /* max-height: 200px; */
  width: 400px;
  overflow-y: auto;
  margin-top: 20px;
}

.comment-card {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  padding: 10px;
}

.user-button {
  font-weight: bold;
  background-color: rgba(15, 14, 14, 0.1);
}

.comment-content {
  color: black;
}

.created-at {
  margin-top: 10px;
  font-size: 12px;
  color: black;
}

.no-comments-message {
  color: #666;
}
</style>
@/components/ui/MyButton.vue
