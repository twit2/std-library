import { Limits } from './Limits';
import { MsgQueueProvider } from './comm/MsgQueueProvider';
import { RabbitMQQueueProvider } from './comm/providers/RabbitMqProvider';
import { User } from './uam/User';
import { generateId } from './util/IdGen';

/**
 * Message queue module.
 */
const MsgQueue = {
    MsgQueueProvider,
    providers: {
        RabbitMQQueueProvider
    }
}

export {
    MsgQueue,
    User,
    Limits,
    generateId
}