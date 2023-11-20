import { NextFunction, Request, Response } from "express";
import { APIRespConstructor, APIResponseCodes } from "../Index";

function handle(err: Error, req: Request, res: Response, next: NextFunction) {
    res.contentType('json');
    res.statusCode = 500;
    res.end(JSON.stringify(APIRespConstructor.fail(APIResponseCodes.GENERIC, ((err as Error).message) || "<no information>")));

    // Print the error
    console.error(`Server error`);
    console.error(err);
}

export const ErrorHandlingMiddleware = {
    handle
}