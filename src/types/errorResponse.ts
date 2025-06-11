export interface ErrorResponse {
    type: string;
    title: string;
    status: number;
    detail: string;
    traceId: string;
}