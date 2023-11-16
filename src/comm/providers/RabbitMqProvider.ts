import { generateId } from "../../Index";
import { MsgQueueProvider } from "../MsgQueueProvider";
import { QueueMessage } from "../QueueMessage";
import * as amqp from 'amqplib';

interface RMQChannel {
    name: string;
    ch: amqp.Channel;
}

/**
 * Represents a RabbitMQ queue provider.
 */
export class RabbitMQQueueProvider extends MsgQueueProvider {
    protected client?: amqp.Connection;
    protected channels: RMQChannel[] = [];

    /**
     * Sets up the RabbitMQ connection.
     * @param url The URL string.
     */
    async setup(url: string): Promise<void> {
        try {
            console.log(`Connecting to rabbitmq...`);
            this.client = await amqp.connect(url);
        } catch(e) {
            console.error(`RabbitMQ Error : ${e}`);
        }
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
        if(this.getChannel(name) != null)
            throw new Error("Channel exists!");

        const ch = await this.client?.createChannel();

        if(!ch)
            throw new Error("Channel not created.");

        await ch?.assertQueue(name, { durable: false });

        this.channels.push({
            name,
            ch
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
        await chObj.ch.consume(name, (msg) => {
            if(!msg)
                return;

            let msgObj = JSON.parse(msg.content.toString()) as QueueMessage<T>;
            cb(msgObj);
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

        chObj.ch.sendToQueue(name, Buffer.from(JSON.stringify({
            id: generateId({ procId: process.ppid, workerId: process.pid }),
            message
        })));
    }

    /**
     * Performs a shutdown.
     */
    async shutdown(): Promise<void> {
        await this.client?.close();
    }
}