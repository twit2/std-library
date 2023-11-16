/**
 * Represents an API response.
 */
export interface APIResponse<T> {
    code: number;
    message?: string;
    success: boolean;
    data?: T;
}