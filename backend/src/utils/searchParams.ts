import {
	customRef,
	nextTick,
	shallowRef,
	triggerRef,
	watch,
	type Ref,
} from "vue";
import { isClient, tryOnScopeDispose, useEventListener } from "@vueuse/core";
import { dateToUTCTimestamp } from "./date";

type SearchParam =
	| string
	| number
	| boolean
	| string[]
	| number[]
	| boolean[]
	| Date
	| undefined;

export function createURLSearchParams(
	init: Record<string, SearchParam>,
): URLSearchParams {
	const searchParams = new URLSearchParams();

	for (const key in init) {
		const value = init[key];

		if (value === undefined) continue;
		if (Array.isArray(value)) {
			for (const item of value) {
				searchParams.append(key, item.toString());
			}
		} else if (value instanceof Date) {
			searchParams.set(key, dateToUTCTimestamp(value).toString());
		} else {
			searchParams.set(key, value.toString());
		}
	}

	return searchParams;
}

const _searchParams = shallowRef(
	new URLSearchParams(isClient ? window.location.search : undefined),
);
let _isListeningPopstate = false;

const _listenPopstate = () => {
	if (!_isListeningPopstate) {
		_isListeningPopstate = true;
		useEventListener("popstate", () => {
			_searchParams.value = new URLSearchParams(window.location.search);
		});

		tryOnScopeDispose(() => {
			_isListeningPopstate = false;
		});
	}
};

export type NavigationMode = "replace" | "push";

const _navigate = (mode: NavigationMode) => {
	const url = new URL(window.location.href);
	url.search = _searchParams.value.toString();

	if (mode === "push") {
		window.history.pushState(window.history.state, "", url.toString());
	} else {
		window.history.replaceState(window.history.state, "", url.toString());
	}
};

export function useSearchParam<T = string | null>(
	name: string,
	options: {
		defaultValue?: NoInfer<T>;
		mode?: NavigationMode;
		serializer?: {
			read: (value: string) => T;
			write: (value: T) => string | null;
		};
	} = {},
): Ref<T> {
	const {
		mode = "replace",
		defaultValue = null as T,
		serializer = {
			read: (value: string | null) => value as T,
			write: (value: T) => value as string | null,
		},
	} = options;

	const getReadableValue = (raw: string | null): T => {
		if (raw === null) return defaultValue;
		return serializer.read(raw);
	};

	let writableValue = _searchParams.value.get(name);
	let readableValue = getReadableValue(writableValue);
	let _trigger: () => void | undefined;

	if (isClient) {
		watch(
			_searchParams,
			() => {
				const newWritableValue = _searchParams.value.get(name);
				if (newWritableValue === writableValue) return;

				readableValue = getReadableValue(newWritableValue);
				writableValue = newWritableValue;
				_trigger();
			},
			{ flush: "sync" },
		);
	}

	_listenPopstate();

	return customRef<T>((track, trigger) => {
		_trigger = trigger;
		return {
			get() {
				track();
				return readableValue;
			},
			set(newReadableValue) {
				const newWritableValue = serializer.write(newReadableValue);
				if (newWritableValue === writableValue) return;

				readableValue = newReadableValue;
				writableValue = newWritableValue;
				if (typeof newWritableValue === "string") {
					_searchParams.value.set(name, newWritableValue);
				} else {
					_searchParams.value.delete(name);
				}
				_trigger();
				triggerRef(_searchParams);

				if (isClient) {
					nextTick(() => _navigate(mode));
				}
			},
		};
	});
}

const isEqualArrays = <T>(a: T[], b: T[]): boolean => {
	if (a.length !== b.length) return false;
	return a.every((v, i) => v === b[i]);
};

export function useSearchParamArray<T = string>(
	name: string,
	options: {
		mode?: NavigationMode;
		serializer?: {
			read: (value: string) => T;
			write: (value: T) => string;
		};
	} = {},
): Ref<T[]> {
	const {
		mode = "replace",
		serializer = {
			read: (value: string) => value as T,
			write: (value: T) => value as string,
		},
	} = options;

	let writableValue = _searchParams.value.getAll(name);
	let readableValue = writableValue.map(serializer.read);
	let _trigger = () => {};

	if (isClient) {
		watch(
			_searchParams,
			() => {
				const newWritableValue = _searchParams.value.getAll(name);
				if (isEqualArrays(newWritableValue, writableValue)) return;

				readableValue = newWritableValue.map(serializer.read);
				writableValue = newWritableValue;
				_trigger();
			},
			{ flush: "sync" },
		);
	}

	_listenPopstate();

	return customRef<T[]>((track, trigger) => {
		_trigger = trigger;
		return {
			get() {
				track();
				return readableValue;
			},
			set(newReadableValue) {
				const newWritableValue = newReadableValue.map(serializer.write);
				if (isEqualArrays(newWritableValue, writableValue)) return;

				readableValue = newReadableValue;
				writableValue = newWritableValue;
				_searchParams.value.delete(name);
				for (const value of newWritableValue) {
					_searchParams.value.append(name, value);
				}
				_trigger();
				triggerRef(_searchParams);

				if (isClient) {
					nextTick(() => _navigate(mode));
				}
			},
		};
	});
}
