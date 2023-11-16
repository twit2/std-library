import { NullMqProvider } from "./NullMqProvider";

/**
 * Represents some sample message.
 */
interface MockQueueMessage {
    text: string;
}

describe('redis msg queue tests', () => {
    let nmq: NullMqProvider;

    beforeAll(async() => {
        nmq = new NullMqProvider();
    });

    test('null mq open test_channel', async() => {
        await nmq.openQueue("test_channel");
    });

    test('null mq create test consumer', async() => {
        await nmq.consume<MockQueueMessage>("test_channel", (msg) => {});
    });

    test('null mq test simple message send/receive', ()=>new Promise<void>(async (resolve, reject) => {
        let tid: NodeJS.Timeout;

        await nmq.openQueue("test_channel2");

        await nmq.consume<MockQueueMessage>("test_channel2", (msgObj) => {
            clearTimeout(tid);
            expect(msgObj).not.toBeUndefined();
            expect(msgObj).not.toBeNull();
            expect(msgObj.id).toBeDefined();
            expect(msgObj.message.text).toBe("Hello");
            resolve();
        })

        tid = setTimeout(()=>{
            reject("No data received.");
        }, 1000);

        await nmq.produce<MockQueueMessage>("test_channel2", { text: "Hello" });
    }));

    afterAll(async() => {
        await nmq.shutdown();
    });
});