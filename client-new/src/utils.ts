import { twMerge } from "tailwind-merge";
import { cx } from "class-variance-authority";
import type { ClassValue } from "class-variance-authority/types";


export const cn = (...inputs: ClassValue[]): string => twMerge(cx(inputs));

export type { ClassValue } from "class-variance-authority/types";