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
