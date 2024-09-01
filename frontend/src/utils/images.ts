export function getCDNImageURL(key: string): string {
	return new URL(key, import.meta.env.PUBLIC_CDN_URL).toString();
}
