import { QueueMessage } from "./QueueMessage";

/**
 * Represents a queue callback.
 */
type ConsumerCallback<T> = (message: QueueMessage<T>) => void;

/**
 * Represents an exchange type.
 */
export enum GenericExchangeType {
    direct,
    fanout
}

/**
 * Default exchange name.
 */
export const MQ_EXCG_DEFAULT = '';

/**
 * Represents a message queue provider.
 */
export abstract class MsgQueueProvider {
    /**
     * Sets up the queue provider.
     * @param url The URL string.
     */
    abstract setup(url: string): Promise<void>;

    /**
     * Opens a new exchange.
     * @param name The name of the exchange to open.
     * @param type The exchange type.
     */
    abstract openExchange(name: string, type: GenericExchangeType): Promise<void>;

    /**
     * Checks if an exchange exists.
     * @param name The name of the exchange to check.
     */
    abstract hasExchange(name: string): boolean;

    /**
     * Checks if a queue exists.
     * @param name The name of the exchange to check.
     */
    abstract hasQueue(name: string): boolean;

    /**
     * Opens a new queue.
     * @param name The name of the queue to open.
     * @param exchange The exchange to use.
     */
    abstract openQueue(exchange: string, name: string): Promise<void>;

    /**
     * Creates a consumer.
     * @param name The channel name to use.
     */
    abstract consume<T>(exchange: string, name: string, cb: ConsumerCallback<T>): Promise<void>;

    /**
     * Creates a producer.
     * @param name The channel name to use.
     */
    abstract produce<T>(exchange: string, name: string, message: T): Promise<void>;

    /**
     * Publishes a message.
     * @param exchange The exchange to publish to.
     * @param message The message to send.
     */
    abstract publish<T>(exchange: string, message: T): Promise<void>;

    /**
     * Shuts down the message queue.
     */
    abstract shutdown(): Promise<void>;
}