import { generateId } from "../../Index";
import { GenericExchangeType, MsgQueueProvider } from "../MsgQueueProvider";
import { QueueMessage } from "../QueueMessage";
import * as amqp from 'amqplib';

interface RMQExchange {
    name: string;
    type: GenericExchangeType;
    ch: amqp.Channel;
}

const EXCG_TYPES = {
    [GenericExchangeType.direct]: "direct",
    [GenericExchangeType.fanout]: "fanout"
}

const SYS_EXCHG = '';

/**
 * Represents a RabbitMQ queue provider.
 */
export class RabbitMQQueueProvider extends MsgQueueProvider {
    protected client?: amqp.Connection;
    protected exchanges: RMQExchange[] = [];
    protected queues: string[] = [];

    /**
     * Sets up the RabbitMQ connection.
     * @param url The URL string.
     */
    async setup(url: string): Promise<void> {
        try {
            console.log(`Connecting to rabbitmq...`);
            this.client = await amqp.connect(url);

            // open system exchange
            await this.openExchange(SYS_EXCHG, GenericExchangeType.direct);
        } catch(e) {
            console.error(`RabbitMQ Error : ${e}`);
        }
    }

    /**
     * Finds an exchange by name.
     * @param name The name of the exchange to find.
     */
    _findEx(name: string): RMQExchange | undefined {
        return this.exchanges.find(x => x.name == name);
    }

    /**
     * Opens a new exchange.
     * @param name The name of the exchange to open.
     * @param type The exchange type.
     */
    async openExchange(name: string, type: GenericExchangeType): Promise<void> {
        const ex = this._findEx(name);

        if(ex)
            throw new Error("Exchange is already open.");

        // Create channel for exchange
        const ch = await this.client?.createChannel();

        if(!ch)
            throw new Error("Channel not created.");

        if(name !== SYS_EXCHG) // We cannot alter the default exchange
            await ch.assertExchange(name, EXCG_TYPES[type], { durable: false });

        this.exchanges.push({
            name,
            type,
            ch
        });
    }

    /**
     * Opens a new queue.
     * @param name The name of the queue to open.
     * @param exchange The exchange to use.
     */
    async openQueue(exchange: string, name: string) {
        if(this.queues.includes(name))
            throw new Error("Queue exists.");

        const ex = this._findEx(exchange);

        if(!ex)
            throw new Error("Exchange not found.");

        await ex.ch.assertQueue(name, { durable: false, autoDelete: true });

        if(exchange !== SYS_EXCHG) // Do not perform bind on system exchange
            await ex.ch.bindQueue(name, exchange, '');

        this.queues.push(name);
    }

    /**
     * Creates a consumer.
     * @param name The channel name to use.
     */
    async consume<T>(exchange: string, name: string, cb: (message: QueueMessage<T>) => void): Promise<void> {
        const ex = this._findEx(exchange);

        if(!ex)
            throw new Error("Exchange does not exist.");

        await ex.ch.consume(name, (msg) => {
            if(!msg)
                return;

            ex.ch.ack(msg);
            let msgObj = JSON.parse(msg.content.toString()) as QueueMessage<T>;
            cb(msgObj);
        });
    }

    /**
     * Creates a producer.
     * @param name The channel name to use.
     */
    async produce<T>(exchange: string, name: string, message: T): Promise<void> {
        const ex = this._findEx(exchange);

        if(!ex)
            throw new Error("Exchange does not exist.");

        ex.ch.sendToQueue(name, Buffer.from(JSON.stringify({
            id: generateId({ procId: process.ppid, workerId: process.pid }),
            message
        })));
    }

    /**
     * Publishes a message.
     * @param exchange The exchange to publish to.
     * @param message The message to send.
     */
    async publish<T>(exchange: string, message: T) {
        const ex = this._findEx(exchange);

        if(!ex)
            throw new Error("Exchange does not exist.");

        ex.ch.publish(exchange, '', Buffer.from(JSON.stringify({
            id: generateId({ procId: process.ppid, workerId: process.pid }),
            message
        })));
    }

    /**
     * Checks if an exchange exists.
     * @param name The name of the exchange to check.
     */
    hasExchange(name: string): boolean {
        return this._findEx(name) != undefined;
    }

    /**
     * Checks if a queue exists.
     * @param name The name of the exchange to check.
     */
    hasQueue(name: string): boolean {
        return this.queues.includes(name);
    }

    /**
     * Performs a shutdown.
     */
    async shutdown(): Promise<void> {
        await this.client?.close();
    }
}