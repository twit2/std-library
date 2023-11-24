import { Limits } from './Limits';
import { APIError } from './api/APIError';
import { APIRespConstructor } from './api/APIRespConstructor';
import { APIResponse } from './api/APIResponse';
import { APIResponseCodes } from './api/APIResponseCodes';
import { MsgQueueProvider } from './comm/MsgQueueProvider';
import { NullMqProvider } from './comm/providers/NullMqProvider';
import { RabbitMQQueueProvider } from './comm/providers/RabbitMqProvider';
import { RPCClient } from './comm/rpc/RPCClient';
import { RPCResponse } from './comm/rpc/RPCResponse';
import { RPCServer } from './comm/rpc/RPCServer';
import { ErrorHandlingMiddleware } from './middleware/ErrorHandlingMiddleware';
import { SessionVerifierMiddleware } from './middleware/SessionVerifMiddleware';
import { T2Session, WithT2Session } from './session/T2Session';
import { UserProfile } from './uam/User';
import { generateId } from './util/IdGen';
import { Regexes } from './util/Regexes';

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
    APIError,
    T2Session,
    WithT2Session,
    Regexes,
    SessionVerifierMiddleware,
    ErrorHandlingMiddleware,
    APIResponse,
    APIResponseCodes,
    APIRespConstructor,
    RPCResponse,
    MsgQueue,
    UserProfile as User,
    Limits,
    generateId
}