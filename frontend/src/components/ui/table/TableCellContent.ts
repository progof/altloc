import { defineComponent, h } from "vue";

/**
 * @link https://github.com/TanStack/table/blob/9ef186f53dbad3047e8cc968a665794de7c44314/packages/vue-table/src/index.ts#L12-L26
 */
export default defineComponent({
	props: ["render", "props"],
	setup: (props) => {
		return () => {
			if (
				typeof props.render === "function" ||
				typeof props.render === "object"
			) {
				return h(props.render, props.props);
			}

			return props.render;
		};
	},
});
