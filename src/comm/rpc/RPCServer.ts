import { GenericExchangeType, MsgQueueProvider } from "../MsgQueueProvider";
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

const SYS_RPCEX_NAME = 'rpcex';

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
     * @param domain The name to use for the RPC queue.
     */
    async init(domain: string) {
        this.queueName = domain;

        // Setup exchange if needed
        if(!this.mq.hasExchange(SYS_RPCEX_NAME))
            await this.mq.openExchange(SYS_RPCEX_NAME, GenericExchangeType.fanout);

        await this.mq.openQueue(SYS_RPCEX_NAME, `${domain}_rpc_req`);
        await this.mq.openQueue(SYS_RPCEX_NAME, `${domain}_rpc_resp`);

        await this.mq.consume<RPCRequestMsg>(SYS_RPCEX_NAME, `${domain}_rpc_req`, async (msg) => {
            // Ensure call is of the right convention
            if(typeof msg.message.jobId !== 'string')
                return;

            if((typeof msg.message.name !== 'string') || (msg.message.name.trim() == ""))
                return;

            let argTypes = "";

            for(let a of msg.message.arguments)
                argTypes += `${typeof a}, `;

            argTypes = argTypes.substring(0, argTypes.length - 2);
            console.log(`RPC call [${domain}] ${msg.message.name}(${argTypes})`);
            
            // Do the call
            try {
                const func = this._getFunc(msg.message.name);

                if(!func) {
                    console.log(`RPC fail [${domain}]: Function ${msg.message.name}() not found.`)
                    return void this._pubResponse({ success: false, code: 1, message: "Error: function not found.", jobId: msg.message.jobId })
                }

                const result = await func.callback(...msg.message.arguments);
                await this._pubResponse({ success: true, code: 0, message: "", data: result, jobId: msg.message.jobId });
            } catch(e) {
                console.log(`RPC fail [${domain}]: Function ${msg.message.name}() threw exception: ${(e as Error).message || "<unknown>"}`)
                await this._pubResponse({ success: false, code: 2, message: `Error: exception occured: ${(e as Error).message || "<unknown>"}`, jobId: msg.message.jobId })
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
        
        await this.mq.publish<RPCResponse<T>>(SYS_RPCEX_NAME, rpcResp);
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