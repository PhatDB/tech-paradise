import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface ApiError extends Error {
    status?: number;
}

export function formatError(error: unknown): ApiError {
    const fallback = new Error('Internal server error') as ApiError;
    fallback.status = 500;

    if (error instanceof Error) {
        const apiError = error as ApiError;
        return {
            name: apiError.name,
            message: apiError.message,
            status: apiError.status ?? 500,
        };
    }

    return fallback;
}