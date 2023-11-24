import { generateId } from "../../Index";
import { GenericExchangeType, MsgQueueProvider } from "../MsgQueueProvider";
import { QueueMessage } from "../QueueMessage";

interface DummyChObject {
    name: string;
    consumerFuncs: Function[];
}

// BIG TODO
// Reimplement!

/**
 * Represents a null queue provider.
 */
export class NullMqProvider extends MsgQueueProvider {
    /**
     * Sets up the queue provider.
     * @param url The URL string.
     */
    async setup(url: string): Promise<void> {
        
    }

    /**
     * Opens a new exchange.
     * @param name The name of the exchange to open.
     * @param type The exchange type.
     */
    async openExchange(name: string, type: GenericExchangeType): Promise<void> {

    }

    /**
     * Opens a new queue.
     * @param name The name of the queue to open.
     * @param exchange The exchange to use.
     */
    async openQueue(exchange: string, name: string): Promise<void> {

    }

    /**
     * Creates a consumer.
     * @param name The channel name to use.
     */
    async consume<T>(exchange: string, name: string, cb: (message: QueueMessage<T>) => void): Promise<void> {

    }

    /**
     * Creates a producer.
     * @param name The channel name to use.
     */
    async produce<T>(exchange: string, name: string, message: T): Promise<void> {

    }

    /**
     * Checks if an exchange exists.
     * @param name The name of the exchange to check.
     */
    hasExchange(name: string): boolean {
        return false;
    }

    /**
     * Checks if a queue exists.
     * @param name The name of the exchange to check.
     */
    hasQueue(name: string): boolean {
        return false;
    }

    /**
     * Shuts down the message queue.
     */
    async shutdown(): Promise<void> {

    }

}