import { APIResponse } from "./APIResponse";

/**
 * Constructs a response.
 * @param code The code to use.
 * @param message The message to send.
 */
function create<T>(success: boolean, code: number, message: string, data?: T): APIResponse<T> {
    return {
        code,
        message,
        success,
        data
    }
}

/**
 * Constructs a failure response.
 * @param code The code to use.
 * @param message The message to send.
 */
function fail<T>(code: number, message: string, data?: T): APIResponse<T> {
    return create(false, code, message, data);
}

export const APIRespConstructor = {
    fail,
    create
}