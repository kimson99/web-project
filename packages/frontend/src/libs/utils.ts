import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Helper function to format UUID for display
export function formatId(id: string): string {
	if (!id || id.length < 8) return id;
	return `${id.slice(0, 4)}...${id.slice(-4)}`;
}
