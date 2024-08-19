import { twMerge } from "tailwind-merge";
import { cx } from "class-variance-authority";
import type { ClassValue } from "class-variance-authority/types";


export const cn = (...inputs: ClassValue[]): string => twMerge(cx(inputs));

export type { ClassValue } from "class-variance-authority/types";

export const getCDNImageURL = (key: string): string => {
	return new URL(key, import.meta.env.VITE_PUBLIC_CDN_URL).toString();
};

export const getAppName = (): string => import.meta.env.VITE_APP_NAME;

export const getSoialMediaURL = (platform: string): string => import.meta.env[`VITE_SOCIAL_MEDIA_${platform.toUpperCase()}`];