import { generateId } from "../../Index";
import { MsgQueueProvider } from "../MsgQueueProvider";
import { QueueMessage } from "../QueueMessage";

interface DummyChObject {
    name: string;
    consumerFuncs: Function[];
}

/**
 * Represents a RabbitMQ queue provider.
 */
export class NullMqProvider extends MsgQueueProvider {
    protected channels: DummyChObject[] = [];
    private testMode: boolean = false;

    /**
     * Creates a new null mq provider.
     */
    constructor(opts: { testMode: boolean } = { testMode: false }) {
        super();
        this.testMode = opts.testMode;
    }

    async setup(url: string): Promise<void> {
        /* empty ... */
    }
    
    /**
     * Gets a channel by name.
     * @param name The name of the channel.
     * @returns 
     */
    private getChannel(name: string) {
        return this.channels.find(x => x.name == name);
    }

    /**
     * Opens a message queue channel.
     * @param name The channel name to use.
     */
    async openQueue(name: string): Promise<void> {
        if((this.getChannel(name) != null) && (!this.testMode))
            throw new Error("Channel exists!");

        this.channels.push({
            name,
            consumerFuncs: []
        });
    }

    /**
     * Creates a new consumer.
     * @param name The name of the channel.
     * @param cb The callback to use.
     */
    async consume<T>(name: string, cb: (message: QueueMessage<T>) => void): Promise<void> {
        const chObj = this.getChannel(name);

        if(!chObj)
            throw new Error("Channel does not exist.");

        //this.client?.on('message', console.log);
        chObj.consumerFuncs.push((msg: any) => {
            if(!msg)
                return;

            cb(msg);
        });
    }

    /**
     * Produces a new message.
     * @param name The channel name.
     * @param message The message to send.
     */
    async produce<T>(name: string, message: T): Promise<void> {
        const chObj = this.getChannel(name);

        if(!chObj)
            throw new Error("Channel not found.");

        for(let f of chObj.consumerFuncs) {
            f({
                id: generateId({ procId: process.ppid, workerId: process.pid }),
                message
            });
        }
    }

    /**
     * Performs a shutdown.
     */
    async shutdown(): Promise<void> {
        this.channels = null as unknown as DummyChObject[];
    }
}