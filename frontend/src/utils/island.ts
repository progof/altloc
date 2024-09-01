import { ref } from "vue";

/**
 * The unique identifier that will be passed to each island to sync the id's on the server and client. Won't be needed after Vue 3.5
 *
 * https://www.radix-vue.com/utilities/config-provider.html#hydration-issue-vue-3-5
 */
const islandId = ref(0);

export const getIslandId = () => ++islandId.value;
