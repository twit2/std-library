import { NextFunction, Request, Response } from "express";
import { APIRespConstructor } from "../api/APIRespConstructor";
import { APIResponseCodes } from "../api/APIResponseCodes";
import { RPCClient } from "../comm/rpc/RPCClient";
import { T2Session, WithT2Session } from "../session/T2Session";

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
        const sessData = await rpcc.makeCall<T2Session>("verify-user", bearerToken);

        if(!sessData) {
            res.statusCode = 403;
            console.log("-- Session data debug failure --");
            console.log(sessData); // Little debug statement
            return res.end(JSON.stringify(APIRespConstructor.fromCode(APIResponseCodes.SERVER_ERROR)));
        }

        let req2 = req as Request & WithT2Session;
        req2.session = sessData;

        next();
    } catch(e) {
        res.statusCode = 403;
        res.end(JSON.stringify(APIRespConstructor.fromCode(APIResponseCodes.ACCESS_DENIED)));
        console.error(e);
    }
}

export const SessionVerifierMiddleware = {
    init,
    handle
}