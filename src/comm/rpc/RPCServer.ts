import { MsgQueueProvider } from "../MsgQueueProvider";
import { RPCResponse } from "./RPCResponse";

interface RPCFunction {
    name: string;
    callback: (...data: any) => Promise<any>;
}

export interface RPCRequestMsg {
    name: string;
    jobId: string;
    arguments: any[];
}

/**
 * Remote procedure call server.
 */
export class RPCServer {
    private mq: MsgQueueProvider;
    private fns: RPCFunction[] = [];
    private queueName = "";

    constructor(mq: MsgQueueProvider) {
        this.mq = mq;
    }

    /**
     * Initializes the RPC server.
     * @param queueName The name to use for the RPC queue.
     */
    async init(queueName: string) {
        this.queueName = queueName;

        await this.mq.openQueue(`${queueName}_rpcreq`);
        await this.mq.openQueue(`${queueName}_rpcresp`);

        await this.mq.consume<RPCRequestMsg>(`${queueName}_rpcreq`, async (msg) => {
            // Ensure call is of the right convention
            if(typeof msg.message.jobId !== 'string')
                return;

            if((typeof msg.message.name !== 'string') || (msg.message.name.trim() == ""))
                return;

            console.log(`RPC call [${queueName}] ${msg.message.name}()`);
            
            // Do the call
            try {
                const func = this._getFunc(msg.message.name);

                if(!func) {
                    console.log(`RPC fail [${queueName}]: Function ${msg.message.name}() not found.`)
                    return void this._pubResponse({ success: false, code: 1, message: "Error: function not found." })
                }

                const result = await func.callback(...msg.message.arguments);
                await this._pubResponse({ success: true, code: 0, message: "", data: result });
            } catch(e) {
                console.log(`RPC fail [${queueName}]: Function ${msg.message.name}() threw exception: ${(e as Error).message || "<unknown>"}`)
                await this._pubResponse({ success: false, code: 2, message: `Error: exception occured: ${(e as Error).message || "<unknown>"}` })
            }
        });
    }

    /**
     * Publishes an RPC response.
     * @param rpcResp 
     */
    async _pubResponse<T>(rpcResp: RPCResponse<T>) {
        if(rpcResp.code == null)
            throw new Error("Code required.");
        
        await this.mq.produce<RPCResponse<T>>(`${this.queueName}_rpcresp`, rpcResp);
    }

    /**
     * Gets an RPC function object.
     * @param name The name of the function to retrieve.
     */
    _getFunc(name: string) {
        return this.fns.find(x => x.name == name);
    }

    /**
     * Defines a new RPC function.
     * @param func The function to define.
     */
    defineProcedure(func: RPCFunction) {
        const exFunc = this._getFunc(func.name);

        if(exFunc)
            throw new Error("Function exists.");

        this.fns.push(func);
    }
}