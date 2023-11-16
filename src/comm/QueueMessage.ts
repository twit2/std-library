/**
 * Represents a queue message.
 */
export interface QueueMessage<T> {
    /**
     * The message ID.
     */
    id: string;

    /**
     * An optional message tag.
     */
    tag?: string;

    /**
     * The message type.
     */
    message: T;
}