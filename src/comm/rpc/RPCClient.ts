import { generateId } from "../../Index";
import { MsgQueueProvider } from "../MsgQueueProvider";
import { RPCResponse } from "./RPCResponse";
import { RPCRequestMsg } from "./RPCServer";

interface PendingRPCJob {
    jobId: string;
    callback: (data: any) => void;
}

export class RPCClient {
    private mq: MsgQueueProvider;
    private queueName: string = "";
    private pendingJobs: PendingRPCJob[] = [];

    constructor(mq: MsgQueueProvider) {
        this.mq = mq;
    }

    /**
     * Initializes an RPC client.
     * @param queueName The name of the queue.
     */
    async init(queueName: string) {
        this.queueName = queueName;

        await this.mq.openQueue(`${queueName}_rpcreq`);
        await this.mq.openQueue(`${queueName}_rpcresp`);

        await this.mq.consume<RPCResponse<any>>(`${queueName}_rpcresp`, (msg) => {
            // Process response
            console.log(msg);
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
    makeCall<T>(name: string, ...args: string[]): Promise<T> {
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
                }
            });

            await this.mq.produce<RPCRequestMsg>(`${this.queueName}_rpcreq`, {
                name,
                jobId,
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