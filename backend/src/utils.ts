import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type {
	PostgresJsDatabase,
	PostgresJsQueryResultHKT,
} from "drizzle-orm/postgres-js";
import * as schema from "@db/schema.js";
import { FormDataEntryValue } from "formdata-node";

export class HTTPError extends Error {
	name = "HTTPError";

	public readonly status: number;

	constructor(
		opts: { status: number; message?: string },
		options?: ErrorOptions
	) {
		super(opts.message, options);
		this.status = opts.status;
	}
}

export type Transaction = PgTransaction<
	PostgresJsQueryResultHKT,
	typeof schema,
	ExtractTablesWithRelations<typeof schema>
>;

export type Database = PostgresJsDatabase<typeof schema>;

export const dateToUTCTimestamp = (date: Date): number => {
	return Math.floor(date.getTime() / 1000);
};

export const utcTimestampToDate = (timestamp: number): Date => {
	return new Date(timestamp * 1000);
};

export class FetchError extends Error {
	override name = "FetchError";

	public readonly response: Response;

	constructor(response: Response, options?: ErrorOptions) {
		const message = response.statusText
			? `${response.status} ${response.statusText} (${response.url})`
			: `${response.status} (${response.url})`;

		super(message, options);
		this.response = response;
	}
}

export function formDataToObject(
	formData: FormData
): Record<string, FormDataEntryValue | FormDataEntryValue[]> {
	return Object.fromEntries(
		Array.from(formData.keys()).map((key) => {
			const value = formData.getAll(key);
			if (value.length === 1) {
				return [key, value[0]];
			}
			return [key, value];
		})
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
	>
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
