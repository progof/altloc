<script setup lang="ts">
import { ref, defineProps } from "vue";
import { z } from "zod";
import { useCreateSpaceEventMutation } from "@/services/event.service";
import { getMeQueryOptions } from "@/services/auth.service";
import { useQuery } from "@tanstack/vue-query";
import Modal from "@/components/Modal.vue";
import MyButton from "@/components/UI/MyButton.vue";
import AddNoteIcon from "@/assets/icons/AddNoteIcon.svg?component";
import { QuillEditor } from "@vueup/vue-quill";
import "quill/dist/quill.snow.css";
import { marked } from "marked";
import { useRouter } from "vue-router";
import MarkdownIt from "markdown-it";
const $router = useRouter();
const { data: me } = useQuery(getMeQueryOptions);
const md = new MarkdownIt();
const renderMarkdown = (text: string) => {
  return md.render(text);
};

const convertToMarkdown = (html: string) => {
  return marked(html);
};

const modalActive = ref(false);

const toggleModal = () => {
  modalActive.value = !modalActive.value;
};

const props = defineProps<{ spaceId: string }>();

const result2 = md.render("# markdown-it rulezz!");
console.log("result2", result2);

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
      [{ color: [] }, { background: [] }], // Add color and background options
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

const DescriptionBodyContent = ref<string>("");

const validationSchema = z.object({
  space_id: z.string().refine((value) => value.trim() !== "", {
    message: "Space ID is required",
  }),
  title: z.string().refine((value) => value.trim() !== "", {
    message: "Title is required",
  }),
  description: z.string().refine((value) => value.trim() !== "", {
    message: "Description is required",
  }),
  start_time: z.string().refine((value) => value.trim() !== "", {
    message: "Start time is required",
  }),
  end_time: z.string().refine((value) => value.trim() !== "", {
    message: "End time is required",
  }),
  date: z.string().refine((value) => value.trim() !== "", {
    message: "Date is required",
  }),
});

const validationErrors = ref<{
  spaceId?: string;
  title?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  date?: string;
}>({});

const { mutate: eventSpace, isPending, error } = useCreateSpaceEventMutation();

const submitForm = async (event: Event) => {
  const rawData = Object.fromEntries(
    new FormData(event.target as HTMLFormElement)
  );

  rawData.space_id = props.spaceId;

  console.log("noteBodyContent", DescriptionBodyContent.value);
  console.log("Raw data:", rawData);
  console.log("My user_id:", me.value?.user_id);

  rawData.description = convertToMarkdown(DescriptionBodyContent.value);
  console.log("rawData.note_body", rawData.body);
  const result = validationSchema.safeParse(rawData);

  console.log("Validation result:", result);
  if (!result.success) {
    console.log("Validation failed:", result.error);
    const error = result.error;
    validationErrors.value.title = error.issues.find(
      (issue) => issue.path[0] === "title"
    )?.message;
    validationErrors.value.description = error.issues.find(
      (issue) => issue.path[0] === "description"
    )?.message;
    validationErrors.value.start_time = error.issues.find(
      (issue) => issue.path[0] === "start_time"
    )?.message;
    validationErrors.value.end_time = error.issues.find(
      (issue) => issue.path[0] === "end_time"
    )?.message;
    validationErrors.value.date = error.issues.find(
      (issue) => issue.path[0] === "date"
    )?.message;

    return;
  }
  validationErrors.value = {};

  console.log("Data to be sent:", result.data);
  eventSpace(result.data, {
    onError: (err) => {
      console.error("Error creating space:", err);
    },
  });
  $router.push(`/spaces/${props.spaceId}`);
};
</script>

<template>
  <div>
    <button @click="toggleModal" class="button">
      <AddNoteIcon style="width: 24px; height: 24px" />
      Create event
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
                <label for="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title..."
                />
                <span v-if="validationErrors.title">{{
                  validationErrors.title
                }}</span>
              </fieldset>

              <fieldset>
                <label for="start_time">Start time:</label>
                <input
                  type="time"
                  id="start_time"
                  name="start_time"
                  placeholder="Start time..."
                />
                <span v-if="validationErrors.start_time">{{
                  validationErrors.start_time
                }}</span>
              </fieldset>

              <fieldset>
                <label for="end_time">End time</label>
                <input
                  type="time"
                  id="end_time"
                  name="end_time"
                  placeholder="End time..."
                />
                <span v-if="validationErrors.end_time">{{
                  validationErrors.end_time
                }}</span>
              </fieldset>

              <fieldset>
                <label for="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  placeholder="Date..."
                />
                <span v-if="validationErrors.date">{{
                  validationErrors.date
                }}</span>
              </fieldset>

              <!-- <fieldset>
                <label for="description">Description:</label>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Description..."
                />
                <span v-if="validationErrors.description">{{
                  validationErrors.description
                }}</span>
              </fieldset> -->

              <fieldset>
                <label for="description">Description:</label>
                <QuillEditor
                  v-model:content="DescriptionBodyContent"
                  theme="snow"
                  id="description"
                  placeholder="Description..."
                  :options="quillOptions"
                  content-type="html"
                />
                <span v-if="validationErrors.description" class="error-message">
                  {{ validationErrors.description }}
                </span>
              </fieldset>
            </div>
            <span v-if="error" class="error-message">{{ error }}</span>
            <MyButton type="submit" :disabled="isPending">
              {{ isPending ? "Fetching..." : "Create event" }}
            </MyButton>
          </form>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
/* .button {
  background-color: transparent;
  border: none;
  cursor: pointer;
} */

.button {
  background-color: rgba(0, 0, 0, 0);
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
