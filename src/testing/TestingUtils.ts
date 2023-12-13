import { RPCMock } from "./mocks/RPCMock";

/**
 * Checks whether the callback fails.
 * @param cb The callback to test for.
 * @param message The error message to use when cb has not failed.
 */
function mustFail(cb: ()=>void, message: string): void {
    try {
        cb();
    } catch(e) {
        return;
    }

    throw new Error(message);
}

/**
 * Checks whether the callback fails asynchronously.
 * @param cb The callback to test for.
 * @param message The error message to use when cb has not failed.
 */
async function mustFailAsync(cb: ()=>Promise<void>, message: string): Promise<void> {
    try {
        await cb();
    } catch(e) {
        return;
    }

    throw new Error(message);
}

export const TestingUtils = {
    mustFail,
    mustFailAsync,
    mocks: {
        RPCMock
    }
}