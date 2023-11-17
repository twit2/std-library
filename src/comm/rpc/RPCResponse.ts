export interface RPCResponse<T> {
    success: boolean;
    code: number;
    message: string;
    data?: T;
    jobId: string;
}
