<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { getNoteQueryOptions, useUpdateNoteMutation } from '@/services/app.service';
import MyButton from '@/components/UI/MyButton.vue';

const route = useRoute();
const $router = useRouter();
const noteId: string = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
const { data: noteData } = useQuery(getNoteQueryOptions(noteId));



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

  await noteUpdate({
    noteId: noteId,
    title: result.data.title,
    description: result.data.description,
    category: result.data.category,
    body: result.data.body,
  });
  $router.push(`/dashboard`);
};
</script>

  <template>
  <div class="wrapper">
    <MyButton class="note-button" @click="$router.push(`/dashboard`)">Back</MyButton>

    <div v-if="noteData" class="note">
      <form @submit.prevent="updateNote">
        <div class="form-group">
          <label for="title">Title:</label>
          <input v-model="noteData.title" type="text" id="title" name="title" required />
        </div>

        <div class="form-group">
          <label for="description">Description:</label>
          <textarea v-model="noteData.description" id="description" name="description" required></textarea>
        </div>

        <div class="form-group">
          <label for="category">Category:</label>
          <input v-model="noteData.category" type="text" id="category" name="category" required />
        </div>

        <div class="form-group">
          <label for="body">Body:</label>
          <textarea v-model="noteData.body" id="body"  name="body" required></textarea>
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
