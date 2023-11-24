import { generateId } from "../../Index";
import { GenericExchangeType, MsgQueueProvider } from "../MsgQueueProvider";
import { RPCResponse } from "./RPCResponse";
import { RPCRequestMsg } from "./RPCServer";

interface PendingRPCJob {
    jobId: string;
    callback: (data: any) => void;
    fail: (message: string) => void;
}

const SYS_RPCEX_NAME = 'rpcex';

export class RPCClient {
    private mq: MsgQueueProvider;
    private domain: string = "";
    private pendingJobs: PendingRPCJob[] = [];
    private clientId: string = "";

    constructor(mq: MsgQueueProvider) {
        this.mq = mq;
        this.clientId = generateId({ workerId: process.pid, procId: process.ppid });
    }

    /**
     * Initializes an RPC client.
     * @param domain The name of the domain.
     */
    async init(domain: string) {
        this.domain = domain;

        // Setup exchange if needed
        if(!this.mq.hasExchange(SYS_RPCEX_NAME))
            await this.mq.openExchange(SYS_RPCEX_NAME, GenericExchangeType.direct);

        await this.mq.openQueue(SYS_RPCEX_NAME, `${domain}_rpc`);
        await this.mq.openQueue(SYS_RPCEX_NAME, `rpc_${this.clientId}`);

        await this.mq.consume<RPCResponse<any>>(SYS_RPCEX_NAME, `rpc_${this.clientId}`, (jMsg) => {
            // Process response
            const job = this.pendingJobs.find(x => x.jobId == jMsg.message.jobId);

            if(job) {
                if(jMsg.message.success)
                    job.callback(jMsg.message.data);
                else
                    job.fail(jMsg.message.message);
            }
        });
    }

    /**
     * Dequeues a job.
     */
    _dequeueJob(jobId: string) {
        const idx = this.pendingJobs.findIndex((x) => x.jobId == jobId);

        if(idx > -1)
            this.pendingJobs.splice(idx, 1);
    }

    /**
     * Makes an RPC call.
     * @param name The name of the function to call.
     * @param args The arguments to pass.
     */
    makeCall<T>(name: string, ...args: any[]): Promise<T> {
        const jobId = generateId({ procId: process.ppid, workerId: process.pid });
        let timeout: NodeJS.Timeout;

        // Add call to response queue
        return new Promise(async (resolve, reject) => {
            this.pendingJobs.push({
                jobId,
                callback: (data: T)=>{
                    this._dequeueJob(jobId);
                    clearTimeout(timeout);
                    resolve(data);
                },
                fail: (message: string) => {
                    this._dequeueJob(jobId);
                    clearTimeout(timeout);
                    reject(message)
                }
            });

            await this.mq.produce<RPCRequestMsg>(SYS_RPCEX_NAME, `${this.domain}_rpc`, {
                name,
                jobId,
                clientId: this.clientId,
                arguments: args
            });

            // Add timeout
            timeout = setTimeout(()=>{
                this._dequeueJob(jobId);
                reject("RPC request timeout.");
            }, 4000);
        });
    }
}