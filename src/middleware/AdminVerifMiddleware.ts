import { NextFunction, Request, Response } from "express";
import { APIRespConstructor } from "../api/APIRespConstructor";
import { APIResponseCodes } from "../api/APIResponseCodes";
import { RPCClient } from "../comm/rpc/RPCClient";

let rpcc: RPCClient;

async function init(client: RPCClient) {
    rpcc = client;
}

/**
 * Handles session verification.
 */
async function handle(req: Request, res: Response, next: NextFunction) {
    res.contentType('json');
    const bearerToken = req.headers.authorization?.substring(7);
    
    if((!bearerToken) || (bearerToken.trim() == "")) {
        res.statusCode = 403;
        return res.end(JSON.stringify(APIRespConstructor.fromCode(APIResponseCodes.INVALID_REQUEST_BODY)));
    }

    try {
        // Check the token
        const role = await rpcc.makeCall<number>("get-role", bearerToken);

        if(role == null) {
            res.statusCode = 403;
            console.log("-- Session data debug failure --");
            console.log(role); // Little debug statement
            return res.end(JSON.stringify(APIRespConstructor.fromCode(APIResponseCodes.SERVER_ERROR)));
        }

        // 1 == admin
        if(role !== 1)
            return res.end(APIRespConstructor.fromCode(APIResponseCodes.ACCESS_DENIED));

        next();
    } catch(e) {
        res.statusCode = 403;
        res.end(JSON.stringify(APIRespConstructor.fromCode(APIResponseCodes.ACCESS_DENIED)));
        console.error(e);
    }
}

export const AdminVerifMiddleware = {
    init,
    handle
}