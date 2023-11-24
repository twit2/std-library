import { APIResponseHead, codeToResp } from "./APIResponseCodes";

export class APIError extends Error {
    public hdr: APIResponseHead;
    public status: number;

    constructor(hdr: APIResponseHead, statusCode: number = 400) {
        super(`API Error: [${hdr.code}] ${hdr.message}`);
        this.hdr = hdr;
        this.status = statusCode;
    }

    /**
     * Creates an error object from the specified API error code.
     * @param code The code to use.
     * @param statusCode The status code to pass.
     */
    static fromCode(code: number, statusCode: number = 400): APIError {
        return new APIError(codeToResp(code), statusCode);
    }
}