import { NullMqProvider } from "./NullMqProvider";

/**
 * Represents some sample message.
 */
interface MockQueueMessage {
    text: string;
}

// BIG TODO
// Reimplement!

describe('redis msg queue tests', () => {
    let nmq: NullMqProvider;

    beforeAll(async() => {
        nmq = new NullMqProvider();
    });

    test('null mq open test_channel', async() => {
        expect(1).toBe(1);
    });

    test('null mq create test consumer', async() => {
        expect(1).toBe(1);
    });

    test('null mq test simple message send/receive', ()=>new Promise<void>(async (resolve, reject) => {
        expect(1).toBe(1);
        resolve();
    }));

    afterAll(async() => {
        await nmq.shutdown();
    });
});