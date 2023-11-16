export enum APIResponseCodes {
    GENERIC = 0,

    // 1000x - generic errors
    SERVER_ERROR = 1000,
    NOT_FOUND = 1001,
    INVALID_REQUEST_BODY = 1002
}

const messages = [
    { code: APIResponseCodes.GENERIC, message: "General failure." },
    { code: APIResponseCodes.SERVER_ERROR, message: "Server error." },
    { code: APIResponseCodes.NOT_FOUND, message: "Resource not found." },
    { code: APIResponseCodes.INVALID_REQUEST_BODY, message: "Invalid request body." }
]

/**
 * Gets a message for the specified request code.
 * @param code The code to get a message for.
 * @param data Additional data to add.
 */
export function codeToMessage(code: number, ...data: any[]) {
    let msg = messages.find(x => x.code == code);

    if(!msg)
        msg = { code: 0, message: "General failure" };

    return msg.message;
}