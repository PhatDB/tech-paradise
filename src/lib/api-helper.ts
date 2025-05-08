// src/lib/api-helper.ts
import axiosClient from './axios';

type QueryParams = Record<string, string | number | boolean | undefined>;

function buildQuery(params?: QueryParams): string {
    if (!params) return '';
    const query = Object.entries(params)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&');
    return query ? `?${query}` : '';
}

export async function apiGet<T>(url: string, params?: QueryParams): Promise<T> {
    try {
        const res = await axiosClient.get<T>(`${url}${buildQuery(params)}`);
        return res.data;
    } catch (error: any) {
        throw formatApiError(error);
    }
}

export async function apiPost<T>(url: string, data: any): Promise<T> {
    try {
        const res = await axiosClient.post<T>(url, data);
        return res.data;
    } catch (error: any) {
        throw formatApiError(error);
    }
}

export async function apiPut<T>(url: string, data: any): Promise<T> {
    try {
        const res = await axiosClient.put<T>(url, data);
        return res.data;
    } catch (error: any) {
        throw formatApiError(error);
    }
}

export async function apiDelete<T>(url: string): Promise<T> {
    try {
        const res = await axiosClient.delete<T>(url);
        return res.data;
    } catch (error: any) {
        throw formatApiError(error);
    }
}

function formatApiError(error: any): Error {
    const status = error?.response?.status || 500;
    const message =
        error?.response?.data?.message ||
        error?.message ||
        'Unknown API error';

    const err = new Error(message);
    (err as any).status = status;
    return err;
}
