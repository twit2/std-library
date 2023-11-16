import { Limits } from './Limits';
import { APIRespConstructor } from './api/APIRespConstructor';
import { APIResponse } from './api/APIResponse';
import { APIResponseCodes } from './api/APIResponseCodes';
import { MsgQueueProvider } from './comm/MsgQueueProvider';
import { NullMqProvider } from './comm/providers/NullMqProvider';
import { RabbitMQQueueProvider } from './comm/providers/RabbitMqProvider';
import { RPCClient } from './comm/rpc/RPCClient';
import { RPCResponse } from './comm/rpc/RPCResponse';
import { RPCServer } from './comm/rpc/RPCServer';
import { UserProfile } from './uam/User';
import { generateId } from './util/IdGen';

/**
 * Message queue module.
 */
const MsgQueue = {
    MsgQueueProvider,
    providers: {
        RabbitMQQueueProvider,
        NullMqProvider
    },
    rpc: {
        RPCServer,
        RPCClient
    }
}

export {
    APIResponse,
    APIResponseCodes,
    APIRespConstructor,
    RPCResponse,
    MsgQueue,
    UserProfile as User,
    Limits,
    generateId
}