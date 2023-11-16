import { QueueMessage } from "./QueueMessage";

/**
 * Represents a queue callback.
 */
type ConsumerCallback<T> = (message: QueueMessage<T>) => void;

/**
 * Represents a message queue provider.
 */
export abstract class MsgQueueProvider {
    /**
     * Sets up the queue provider.
     * @param hostname The hostname to use.
     * @param port The port to use.
     */
    abstract setup(hostname: string, port: number): Promise<void>;

    /**
     * Opens a new channel.
     * @param name The name of the channel to open.
     */
    abstract openQueue(name: string): Promise<void>;

    /**
     * Creates a consumer.
     * @param name The channel name to use.
     */
    abstract consume<T>(name: string, cb: ConsumerCallback<T>): Promise<void>;

    /**
     * Creates a producer.
     * @param name The channel name to use.
     */
    abstract produce<T>(name: string, message: T): Promise<void>;

    /**
     * Shuts down the message queue.
     */
    abstract shutdown(): Promise<void>;
}