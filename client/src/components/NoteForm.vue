<script setup lang="ts">
  import { ref } from 'vue';
  import { z } from 'zod';
  import { useNoteCreateMutation } from '@/services/app.service';
  import { getMeQueryOptions } from "@/services/auth.service";
  import { useQuery } from "@tanstack/vue-query";
  import MyButton from '@/components/UI/MyButton.vue';
  import { QuillEditor } from '@vueup/vue-quill';
import 'quill/dist/quill.snow.css';

  const { data: me } = useQuery(getMeQueryOptions);

const noteBodyContent = ref<string>('');
const contentType = ref('html'); // Set the appropriate content type

  const validationSchema = z.object({
  note_title: z.string().refine((value) => value.trim() !== '', {
    message: 'Title is required',
  }),
  note_description: z.string().refine((value) => value.trim() !== '', {
    message: 'Description is required',
  }),
  note_body: z.string().refine((value) => {
    if (typeof value === 'string') {
      return value.trim() !== '';
    }
    return false;
  }, {
    message: 'Body is required',
  }),
  note_category: z.string().refine((value) => value.trim() !== '', {
    message: 'Category is required',
  }),
});

const validationErrors = ref<{
	note_title?: string;
	note_description?: string;
	note_body?: string;
    note_category?: string;
}>({});

const { mutate: noteCreate, isPending, error } = useNoteCreateMutation();

const submitForm = async (event: Event) => {
	const rawData = Object.fromEntries(
		new FormData(event.target as HTMLFormElement)
	);
    console.log("noteBodyContent", noteBodyContent.value);
	console.log('Raw data:', rawData); // Debug
	console.log('My user_id:', me.value?.user_id); // Debug
    rawData.note_body = noteBodyContent.value;
	const result = validationSchema.safeParse(rawData);

    console.log("rawData.note_body", rawData.note_body)


	console.log('Validation result:', result); // Debug
	if (!result.success) {
		console.log('Validation failed:', result.error); // Debug
		const error = result.error;
		validationErrors.value.note_title = error.issues.find(
			(issue) => issue.path[0] === "note_title"
		)?.message;
		validationErrors.value.note_description = error.issues.find(
			(issue) => issue.path[0] === "note_description"
		)?.message;
		validationErrors.value.note_body = error.issues.find(
			(issue) => issue.path[0] === "note_body"
		)?.message;
		validationErrors.value.note_category = error.issues.find(
			(issue) => issue.path[0] === "note_category"
		)?.message;
		return;
	}
	validationErrors.value = {};


	console.log('Data to be sent:', result.data); // Debug
	noteCreate({
    ...result.data,
    user_id: me.value!.user_id as string,
  }, {
    onSuccess: () => {
      alert("Create a new note!");
    },
    onError: (err) => {
      console.error('Error creating note:', err);
    }
  });

};

  </script>
  
  <template>
	  <form @submit.prevent="submitForm">
		<fieldset>
			<label for="note_title">Title:</label>
			<input type="note_title" id="note_title" name="note_title" />
			<span v-if="validationErrors.note_title">{{ validationErrors.note_title }}</span>
		</fieldset>

		<fieldset>
			<label for="note_category">Category:</label>
			<input type="note_category" id="note_category" name="note_category" />
			<span v-if="validationErrors.note_category">{{ validationErrors.note_category }}</span>
		</fieldset>

		<fieldset>
			<label for="note_description">Description:</label>
			<textarea type="note_description" id="note_description" name="note_description" />
			<span v-if="validationErrors.note_description">{{ validationErrors.note_description }}</span>
		</fieldset>

		<fieldset>
			<label for="note_body">Body:</label>
			<!-- <textarea type="note_body" id="note_body" name="note_body" /> -->
            <QuillEditor v-model:content="noteBodyContent" theme="snow" id="note_body" name="note_body" :content-type="contentType" />
			<span v-if="validationErrors.note_body">{{ validationErrors.note_body }}</span>
		</fieldset>
  
		<span v-if="error">{{ error }}</span>

		<my-button type="submit" :disabled="isPending">
			{{ isPending ? "Fetching..." : "Create note" }}
		</my-button>
	  </form>
  </template>


  <style scoped>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  h1 {
    color: teal;
  }
  
  span {
    display: block;
    margin-bottom: 10px;
    color: teal;
  }
  
  form {
    margin-top: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    color: teal;
  }
  
  input,
  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
  }
  
  button[type="submit"] {
    background-color: teal;
    color: white;
  }
  
  fieldset {
    border: none;
  }
  
  </style>
  