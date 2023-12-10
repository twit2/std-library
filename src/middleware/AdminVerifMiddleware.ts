import { NextFunction, Request, Response } from "express";
import { APIRespConstructor } from "../api/APIRespConstructor";
import { APIResponseCodes } from "../api/APIResponseCodes";
import { RPCClient } from "../comm/rpc/RPCClient";
import { WithT2Session } from "../session/T2Session";

let rpcc: RPCClient;

async function init(client: RPCClient) {
    rpcc = client;
}

/**
 * Handles session verification.
 */
async function handle(req: Request, res: Response, next: NextFunction) {
    res.contentType('json');
    let req2 = req as Request & WithT2Session;

    try {
        // Check the token
        const role = await rpcc.makeCall<number>("get-role", req2.session.id);

        if(role == null) {
            res.statusCode = 403;
            console.log("-- Session data debug failure --");
            console.log(role); // Little debug statement
            return res.end(JSON.stringify(APIRespConstructor.fromCode(APIResponseCodes.SERVER_ERROR)));
        }

        // 1 == admin
        if(role !== 1)
            return res.end(JSON.stringify(APIRespConstructor.fromCode(APIResponseCodes.ACCESS_DENIED)));

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