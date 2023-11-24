import { GenericExchangeType, MQ_EXCG_DEFAULT } from "../MsgQueueProvider";
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
        await this.openExchange(MQ_EXCG_DEFAULT, GenericExchangeType.direct);
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

    test('rabbitmq create queue (test_queue) on default exchange', async() => {
        await rmq.openQueue(MQ_EXCG_DEFAULT, "test_queue");
    });

    test('rabbitmq create test consumer for test_queue', async() => {
        await rmq.consume<MockQueueMessage>(MQ_EXCG_DEFAULT, "test_queue", (msg) => {});
    });

    test('rabbitmq test simple message send/receive on default exchange', ()=>new Promise<void>(async (resolve, reject) => {
        let tid: NodeJS.Timeout;

        await rmq.openQueue(MQ_EXCG_DEFAULT, "test_queue2");

        await rmq.consume<MockQueueMessage>(MQ_EXCG_DEFAULT, "test_queue2", (msgObj) => {
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

        await rmq.produce<MockQueueMessage>(MQ_EXCG_DEFAULT, "test_queue2", { text: "Hello" });
    }));

    test('rabbitmq creation of fanout exchange', async() => {
        await rmq.openExchange('fanout-test', GenericExchangeType.fanout);
        expect(rmq._findEx('fanout-test')).not.toBeUndefined();
    });

    test('rabbitmq test send/recv on fanout exchange', ()=>{
        const FANOUT_TEST_EX = 'fanout-test';
        const TEST_QUEUE = 'test-queue3';

        return new Promise<void>(async (resolve, reject) => {
            let tid: NodeJS.Timeout;

            await rmq.openQueue(FANOUT_TEST_EX, TEST_QUEUE);

            await rmq.consume<MockQueueMessage>(FANOUT_TEST_EX, TEST_QUEUE, (msgObj) => {
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

            await rmq.produce<MockQueueMessage>(FANOUT_TEST_EX, TEST_QUEUE, { text: "Hello" });
        });
    });

    afterAll(async() => {
        await rmq.shutdown();
    });
});