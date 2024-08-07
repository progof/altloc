import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type {
	PostgresJsDatabase,
	PostgresJsQueryResultHKT,
} from "drizzle-orm/postgres-js";
import * as schema from "@db/schema";

export class HTTPError extends Error {
	name = "HTTPError";

	public readonly status: number;

	constructor(
		opts: { status: number; message?: string },
		options?: ErrorOptions,
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


