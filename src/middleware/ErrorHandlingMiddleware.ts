import { NextFunction, Request, Response } from "express";
import { APIError, APIRespConstructor, APIResponseCodes } from "../Index";

function handle(err: Error, req: Request, res: Response, next: NextFunction) {
    res.contentType('json');

    if(err instanceof APIError) {
        res.statusCode = err.status;
        res.end(JSON.stringify(err.hdr));
    } else {
        res.statusCode = 500;
        res.end(JSON.stringify(APIRespConstructor.fail(APIResponseCodes.GENERIC, ((err as Error).message) || "<no information>")));
    }

    // Print the error
    console.error(`Server error`);
    console.error(err);
}

export const ErrorHandlingMiddleware = {
    handle
}