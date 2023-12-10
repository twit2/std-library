import { TestingUtils } from "./TestingUtils";

describe('testing utils tests', ()=>{
    test('mustFail should succeed on failure', ()=>{
        TestingUtils.mustFail(()=>{throw new Error("Failed!!")}, "Successful failure");
    });

    test('mustFail should fail on non-failure', ()=>{
        try {
            TestingUtils.mustFail(()=>{}, "Successful failure");
        } catch(e) {
            return;
        }

        throw new Error("mustFail did not fail");
    });

    test('mustFailAsync should succeed on failure', async()=>{
        await TestingUtils.mustFailAsync(()=>{throw new Error("Failed!!")}, "Successful failure");
    });

    test('mustFailAsync should fail on non-failure', async ()=>{
        try {
            await TestingUtils.mustFailAsync(async ()=>{}, "Successful failure");
        } catch(e) {
            return;
        }

        throw new Error("mustFailAsync did not fail");
    });
});