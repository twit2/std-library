import { TestingUtils } from "../TestingUtils";
import { MockRPCClient, MockRPCServer } from "./RPCMock";

describe('rpc server mock tests', ()=>{
    let mockServer: MockRPCServer = new MockRPCServer();

    test('mock server should define procedure', ()=> {
        mockServer.defineProcedure({
            name: "test",
            callback: async()=>1+1
        })

        const func = mockServer._getFunc('test');
        expect(func).not.toBeUndefined();
        expect(func?.name).toBe('test');
        expect(typeof func?.callback).toBe('function');
    });

    test('mock server should not define dupe procedure', ()=> {
        TestingUtils.mustFail(()=>mockServer.defineProcedure({ name: "test", callback: async()=>1+1 }), "Duplicate procedure created.");
    });
});

describe('rpc client mock tests', ()=>{ 
    let mockServer: MockRPCServer = new MockRPCServer();
    let mockClient: MockRPCClient = new MockRPCClient();

    beforeAll(()=> {
        mockServer.defineProcedure({
            name: 'add',
            callback: async(a, b)=>a + b
        });
    });

    test('mock client should set client correctly', ()=>{
        mockClient.setMockServer(mockServer);
        expect(mockClient.mockServer).toBe(mockServer);
    });

    test('mock client should reject nonexistent function', async() => {
        await TestingUtils.mustFailAsync(async()=>await mockClient.makeCall('fail function'), "Lookup did not error.");
    });

    test('mock client should call function correctly', async() => {
        const result = await mockClient.makeCall("add", 1, 1);
        expect(result).toBe(2);
    });
});