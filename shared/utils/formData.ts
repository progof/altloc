export function formDataToObject(
	formData: FormData,
): Record<string, FormDataEntryValue | FormDataEntryValue[]> {
	return Object.fromEntries(
		Array.from(formData.keys()).map((key) => {
			const value = formData.getAll(key);
			if (value.length === 1) {
				return [key, value[0]];
			}
			return [key, value];
		}),
	);
}

export function objectToFromData(
	obj: Record<
		string,
		| undefined
		| boolean
		| number
		| string
		| Blob
		| Array<boolean | number | string | Blob | undefined>
	>,
): FormData {
	const formData = new FormData();

	for (const [key, value] of Object.entries(obj)) {
		if (value === undefined) continue;
		if (Array.isArray(value)) {
			for (const item of value) {
				if (item) {
					formData.append(key, item.toString());
				}
			}
			continue;
		}
		if (value instanceof Blob) {
			formData.set(key, value);
			continue;
		}

		formData.set(key, value.toString());
	}

	return formData;
}
