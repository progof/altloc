<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { getNoteQueryOptions, useUpdateNoteMutation } from '@/services/app.service';
import { getMeQueryOptions} from '@/services/auth.service';
import MyButton from '@/components/UI/MyButton.vue';
import { QuillEditor } from "@vueup/vue-quill";
import "quill/dist/quill.snow.css";
import { marked } from "marked";

const route = useRoute();
const $router = useRouter();
const noteId: string = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
const { data: me } = useQuery(getMeQueryOptions);
const { data: noteData } = useQuery(getNoteQueryOptions(noteId));
const userId  = me.value?.user_id || '';;

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

const noteBodyContent = ref<string>(noteData.value?.body || '');
console.log("Debig CoteBodyContent.value", noteBodyContent.value);

const convertToMarkdown = (html: string) => {
  if (noteBodyContent.value) {
    return marked(html);
  }
  return ''; // or handle the case where data is not loaded
};


const validationSchema = z.object({
	title: z.string().refine((value) => value.trim() !== "", {
		message: "Title is required",
	}),
	description: z.string().refine((value) => value.trim() !== "", {
		message: "Description is required",
	}),
	body: z.string().refine(
		(value) => {
			if (typeof value === "string") {
				return value.trim() !== "";
			}
			return false;
		},
		{
			message: "Body is required",
		}
	),
	category: z.string().refine((value) => value.trim() !== "", {
		message: "Category is required",
	}),
});

const validationErrors = ref<{
	title?: string;
	description?: string;
	body?: string;
	category?: string;
}>({});

const { mutate: noteUpdate, isPending, error } = useUpdateNoteMutation();

const updateNote = async (event: Event) => {
	const rawData = Object.fromEntries(
		new FormData(event.target as HTMLFormElement)
	);

  const result = validationSchema.safeParse(rawData);
  rawData.body = convertToMarkdown(noteData.value?.body || '');
  // rawData.body = noteData.value?.body || '';

	console.log("Validation result:", result);
	if (!result.success) {
		console.log("Validation failed:", result.error);
		const error = result.error;
		validationErrors.value.title = error.issues.find(
			(issue) => issue.path[0] === "note_title"
		)?.message;
		validationErrors.value.description = error.issues.find(
			(issue) => issue.path[0] === "note_description"
		)?.message;
		validationErrors.value.body = error.issues.find(
			(issue) => issue.path[0] === "note_body"
		)?.message;
		validationErrors.value.category = error.issues.find(
			(issue) => issue.path[0] === "note_category"
		)?.message;
		return;
	}
	validationErrors.value = {};

	console.log("Data to be sent:", result.data);
  console.log("noteData.body", result.data.body);
  await noteUpdate({
    noteId: noteId,
    userId: userId,
    title: result.data.title,
    description: result.data.description,
    category: result.data.category,
    body: result.data.body,
  }, {
		onError: (err) => {
			console.error("Error updating note:", err);
		},
	});

  $router.push(`/dashboard`);
};
</script>

  <template>
    <h1>Hi, {{ me?.username }} 👋</h1>
  <div class="wrapper">
    <MyButton class="note-button" @click="$router.push(`/dashboard`)">Back</MyButton>

    <div v-if="noteData" class="note">
      <form @submit.prevent="updateNote">
        <div class="form-group">
          <label for="note_title">Title:</label>
          <input v-model="noteData.title" type="text" id="note_title" name="note_title" required />
          <span v-if="validationErrors.description">{{ validationErrors.title }}</span>
        </div>

        <div class="form-group">
          <label for="note_description">Description:</label>
          <textarea v-model="noteData.description" id="note_description" name="note_description" required></textarea>
          <span v-if="validationErrors.description">{{ validationErrors.description }}</span>
        </div>

        <div class="form-group">
          <fieldset>
            <label for="note_category">Category:</label>
              <select v-model="noteData.category" id="note_category" name="note_category">
                <option value="">Select a category</option>
                <option value="🧑‍💻 IT">🧑‍💻 IT</option>
                <option value="🌽 Eco">🌽 Eco</option>
                <option value="👷‍♂️ Build">👷‍♂️ Build</option>
                <option value="🧑‍🎨 Art">🧑‍🎨 Art</option>
                <option value="🚀 Crypto">🚀 Crypto</option>
              </select>
              <span v-if="validationErrors.category">{{ validationErrors.category }}</span>
          </fieldset>
        </div>

        <div class="form-group">
          <label for="note_body">Body:</label>
          <!-- <textarea v-model="noteData.body" id="note_body"  name="note_body" required></textarea> -->
          <QuillEditor
				    v-model:content="noteData.body"
				    theme="snow"
				    id="note_body"
				    name="note_body"
				    :options="quillOptions"
				    contentType="html"
			    />
          <span v-if="validationErrors.description">{{ validationErrors.body }}</span>
        </div>

        <div class="form-group">
          <MyButton type="submit" :disabled="isPending">
			      {{ isPending ? "Fetching..." : "Save note" }}
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
  .wrapper {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;
  }

  h3 {
    color: teal;
    padding-bottom: 10px;
  }

  .note-description p,
  .note-body p,
  .note-category p,
  .note-created_at p,
  .note-author p,
  .noteID p {
    margin-bottom: 10px;
  }

  .note-description,
  .note-body,
  .note-category,
  .note-created_at,
  .note-author,
  .noteID {
    margin-top: 20px;
  }

  .noteID p {
    font-weight: bold;
  }

  /* Additional styles for MyButton component */
  .note-button {
    margin-top: 20px;
  }
  .note-header h3 {
    color: teal;
    margin-bottom: 15px;
  }

  .note-info {
    margin-top: 20px;
  }

  .note-info p {
    margin-bottom: 10px;
  }

  .note-info p strong {
    margin-right: 5px;
  }
</style>
