<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { getMeQueryOptions, useLogoutMutation } from '@/services/auth.service';
import NoteForm from '@/components/NoteForm.vue';
import NoteList from '@/components/NoteList.vue';
import MyButton from '@/components/UI/MyButton.vue';
import MyDialog from '@/components/UI/MyDialog.vue';
const router = useRouter();

const { data: me } = useQuery(getMeQueryOptions);
const { mutate: logout } = useLogoutMutation();

const show = ref(false);

const toggleDialog = () => {
  show.value = !show.value;
};
console.log(toggleDialog);

const hideDialog = () => {
  show.value = false;
};
</script>

<template>
	<div class="dashboard">
		<h1>Hi, {{ me?.username }} 👋</h1>
	  	<span>Your Email: {{ me?.email }}</span>
	  	<span>Account status: {{ me?.is_verified ? "🏅 verified " : "🚫 not verified" }}</span>
	  	<my-button
			@click="
		  	logout(undefined, {
			onSuccess: () => {
				router.push('/');
			},
		  	})
			"
	  	>	
			Logout
	  	</my-button>
  
	  	<my-button @click="toggleDialog">Open</my-button>

    	<my-dialog :show="show" @hideDialog="hideDialog">
      	<note-form />
    	</my-dialog>


		<note-form />
	  	<note-list />
	</div>
</template>
 
<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

h1 {
  color: teal;
}

span {
  display: block;
  margin-bottom: 10px;
  color: teal;
}

note-form,
note-list {
  margin-top: 20px;
}
</style>
