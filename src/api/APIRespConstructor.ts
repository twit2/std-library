import { APIResponse } from "./APIResponse";
import { codeToResp } from "./APIResponseCodes";

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

/**
 * Constructs a Success response.
 * @param code The code to use.
 * @param message The message to send.
 */
function success<T>(data?: T): APIResponse<T> {
    return create(true, 0, "", data);
}

/**
 * Creates a response from an existing code.
 * @param data The data to use.
 */
function fromCode<T>(code: number, data?: T) {
    const r = codeToResp(code);

    return {
        code,
        success: r.success,
        message: r.message,
        data
    }
}

export const APIRespConstructor = {
    success,
    fromCode,
    fail,
    create
}