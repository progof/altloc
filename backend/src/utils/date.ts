/**
 * @returns UTC timestamp (seconds since midnight, January 1, 1970 UTC)
 */
export function dateToUTCTimestamp(date: Date): number {
	return Math.floor(date.getTime() / 1000);
}

/**
 * @param timestamp UTC timestamp (seconds since midnight, January 1, 1970 UTC)
 */
export function utcTimestampToDate(timestamp: number): Date {
	return new Date(timestamp * 1000);
}
