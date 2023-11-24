import { RabbitMQQueueProvider } from "./RabbitMqProvider";
const mock_amqp = require('mock-amqplib');

/**
 * Mock Rmq provider.
 * 
 * This simply creates a mock client in place of a real one.
 */
class MockRabbitMQQueueProvider extends RabbitMQQueueProvider {
    constructor() {
        super();
    }

    async setup() {
        this.client = await mock_amqp.connect(`amqp://localhost:5672`);
    }
}

/**
 * Represents some sample message.
 */
interface MockQueueMessage {
    text: string;
}

describe('rabbitmq msg queue tests', () => {
    let rmq: MockRabbitMQQueueProvider;

    beforeAll(async() => {
        rmq = new MockRabbitMQQueueProvider();
        await rmq.setup();
    });

    test('rabbitmq open test_channel', async() => {
        await rmq.openQueue("test_channel");
    });

    test('rabbitmq create test consumer', async() => {
        await rmq.consume<MockQueueMessage>("test_channel", (msg) => {});
    });

    test('rabbitmq test simple message send/receive', ()=>new Promise<void>(async (resolve, reject) => {
        let tid: NodeJS.Timeout;

        await rmq.openQueue("test_channel2");

        await rmq.consume<MockQueueMessage>("test_channel2", (msgObj) => {
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

        await rmq.produce<MockQueueMessage>("test_channel2", { text: "Hello" });
    }));

    afterAll(async() => {
        await rmq.shutdown();
    });
});