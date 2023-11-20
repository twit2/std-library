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
        const jwt = await rpcc.makeCall("verify-user", bearerToken);

        if(!jwt) {
            res.statusCode = 403;
            return res.end(JSON.stringify(APIRespConstructor.fromCode(APIResponseCodes.ACCESS_DENIED)));
        }

        next();
    } catch(e) {
        res.statusCode = 403;
        res.end(JSON.stringify(APIRespConstructor.fromCode(APIResponseCodes.ACCESS_DENIED)));
        console.error(e);
    }

    res.end();
}

export const SessionVerifierMiddleware = {
    init,
    handle
}