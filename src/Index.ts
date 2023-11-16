import { Limits } from './Limits';
import { APIRespConstructor } from './api/APIRespConstructor';
import { APIResponse } from './api/APIResponse';
import { APIResponseCodes } from './api/APIResponseCodes';
import { MsgQueueProvider } from './comm/MsgQueueProvider';
import { NullMqProvider } from './comm/providers/NullMqProvider';
import { RabbitMQQueueProvider } from './comm/providers/RabbitMqProvider';
import { User } from './uam/User';
import { generateId } from './util/IdGen';

/**
 * Message queue module.
 */
const MsgQueue = {
    MsgQueueProvider,
    providers: {
        RabbitMQQueueProvider,
        NullMqProvider
    }
}

export {
    APIResponse,
    APIResponseCodes,
    APIRespConstructor,
    MsgQueue,
    User,
    Limits,
    generateId
}