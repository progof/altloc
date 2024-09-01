import type { TdHTMLAttributes, ThHTMLAttributes, VNode } from "vue";

export interface TableColumnDef<T> {
	key: string;
	header:
		| string
		| ((props: { rows: T[] }) => VNode | string | null | undefined);
	headerAttributes?: ThHTMLAttributes;
	cellAttributes?: TdHTMLAttributes;
	cell: string | ((props: { row: T }) => VNode | string | null | undefined);
}
