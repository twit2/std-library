export enum APIResponseCodes {
    GENERIC = 0,

    // 1000x - generic errors
    SERVER_ERROR = 1000,
    NOT_FOUND = 1001,
    INVALID_REQUEST_BODY = 1002
}

const responses = [
    { code: APIResponseCodes.GENERIC, message: "General failure.", success: false },
    { code: APIResponseCodes.SERVER_ERROR, message: "Server error.", success: false },
    { code: APIResponseCodes.NOT_FOUND, message: "Resource not found.", success: false },
    { code: APIResponseCodes.INVALID_REQUEST_BODY, message: "Invalid request body.", success: false }
]

/**
 * Gets a message for the specified request code.
 * @param code The code to get a message for.
 * @param data Additional data to add.
 */
export function codeToResp(code: number, ...data: any[]) {
    let msg = responses.find(x => x.code == code);

    if(!msg)
        msg = { code: 0, message: "General failure", success: false };

    return msg;
}