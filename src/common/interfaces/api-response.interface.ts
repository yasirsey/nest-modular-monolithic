// src/common/interfaces/api-response.interface.ts
export type CommonApiResponse<T> = {
    success: boolean;
    data: T;
    timestamp: string;
}
