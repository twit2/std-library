import { RPCClient } from "../rpc/RPCClient";
import { RPCServer } from "../rpc/RPCServer";
import { RabbitMQQueueProvider } from "./RabbitMqProvider";
const mock_amqp = require('mock-amqplib');

/**
 * Mock rabbitmq provider.
 * 
 * This simply creates a mock client in place of a real one.
 */
class MockRabbitMQQueueProvider extends RabbitMQQueueProvider {
    constructor() {
        super();
    }

    async setup() {
        await super.setup('amqp://localhost:5672');
        //this.client = await mock_amqp.connect(`amqp://localhost:5672`);
    }
}

interface SumResult {
    result: number;
}

describe('rabbitmq provider integration tests', ()=> {
    const TEST_RPC_QUEUE = "rpc-test";

    // ---- 
    let cl_rmq: MockRabbitMQQueueProvider;
    let sr_rmq: MockRabbitMQQueueProvider;
    let rpcs: RPCServer;
    let rpcc: RPCClient;
    // -----

    beforeAll(async() => {
        cl_rmq = new MockRabbitMQQueueProvider();
        sr_rmq = new MockRabbitMQQueueProvider();
        await cl_rmq.setup();
        await sr_rmq.setup();
    });

    // -----

    test('setup rpc server and init queues', async ()=>{
        rpcs = new RPCServer(cl_rmq);
        await rpcs.init(TEST_RPC_QUEUE);
    });

    test('setup rpc client', async ()=>{
        rpcc = new RPCClient(sr_rmq);
        await rpcc.init(TEST_RPC_QUEUE);
    });

    test('server define test rpc functions', async() =>{
        rpcs.defineProcedure({
            name: 'testfunc',
            callback: (async(a: number, b: number) => {
                return { result: a + b } as SumResult;
            })
        });

        expect(rpcs._getFunc('testfunc')).not.toBeUndefined();
        expect(rpcs._getFunc('testfunc')).not.toBeNull();
        expect(rpcs._getFunc('testfunc')?.callback).not.toBeUndefined();
        expect(rpcs._getFunc('testfunc')?.callback).not.toBeNull();
    });
    
    test('client make simple test call to server', ()=>{
        return new Promise<void>(async(resolve, reject) => {
            let tid = setTimeout(()=>reject("Timeout!"), 2000);

            try {
                const value = await rpcc.makeCall<SumResult>('testfunc', 3, 1);
                expect(value.result).toBe(4);
                clearTimeout(tid);
                resolve();
            } catch(e) {
                clearTimeout(tid);
                reject(e);
            }
        });
    });

    test('client make many simple calls to server', ()=>{
        return new Promise<void>(async(resolve, reject) => {
            for(let x = 0; x < 10; x++) {
                let tid = setTimeout(()=>reject("Timeout!"), 2000);
                const operandA = Math.floor(Math.random() * 1000);
                const operandB = Math.floor(Math.random() * 1000);
                const sum = operandA + operandB;

                try {
                    const value = await rpcc.makeCall<SumResult>('testfunc', operandA, operandB);
                    expect(value.result).toBe(sum);
                    clearTimeout(tid);
                } catch(e) {
                    clearTimeout(tid);
                    reject(e);
                }
            }

            resolve();
        });
    });

    afterAll(async()=>{
        await cl_rmq.shutdown();
        await sr_rmq.shutdown();
    });
});