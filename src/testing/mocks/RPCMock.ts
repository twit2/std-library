import { RPCFunction } from "../../comm/rpc/RPCServer";

/**
 * Mock RPC server.
 */
export class MockRPCServer {
    private fns: RPCFunction[] = [];

    constructor() {}

    /**
     * Initializes the RPC server.
     * @param domain The name to use for the RPC queue.
     */
    /* istanbul ignore next */
    async init(domain: string) { /* mock impl */ }

    /**
     * Gets an RPC function object.
     * @param name The name of the function to retrieve.
     */
    _getFunc(name: string) {
        return this.fns.find(x => x.name == name);
    }

    /**
     * Defines a new RPC function.
     * @param func The function to define.
     */
    defineProcedure(func: RPCFunction) {
        const exFunc = this._getFunc(func.name);

        if(exFunc)
            throw new Error("Function exists.");

        this.fns.push(func);
    }
}

/**
 * Mock RPC client.
 */
export class MockRPCClient {
    mockServer?: MockRPCServer;

    constructor() {}

    /**
     * Sets the mock RPC server.
     */
    setMockServer(server: MockRPCServer) {
        this.mockServer = server;
    }

    /**
     * Initializes an RPC client.
     * @param domain The name of the domain.
     */
    /* istanbul ignore next */
    async init(domain: string) {}

    /**
     * Makes an RPC call.
     * @param name The name of the function to call.
     * @param args The arguments to pass.
     */
    async makeCall<T>(name: string, ...args: any[]): Promise<T> {
        if(!this.mockServer)
            throw new Error("Mock server not set up.");

        const func = this.mockServer._getFunc(name);

        if(!func)
            throw new Error("Function not defined.");

        return await func.callback(...args);
    }
}

export const RPCMock = {
    MockRPCServer,
    MockRPCClient
}