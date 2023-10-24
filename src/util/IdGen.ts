const TW2_EPOCH = 1009872000000;
let _idc = 0;

/**
 * ID properties.
 */
interface IDProps {
    workerId: number;
    procId: number;
}

/**
 * Generates a new identifier.
 * @param props The properties to pass.
 * @returns The generated ID.
 */
export function generateId(props: IDProps) {
    if(props.procId < 0)
        throw new Error("Process id >= 0");

    if(props.workerId < 0)
        throw new Error("Worker id >= 0");

    const c = BigInt(_idc++);
    const t = BigInt(Date.now() - TW2_EPOCH) << BigInt(22);
    const w = BigInt(props.workerId);
    const p = BigInt(props.procId);

    let r = t << BigInt(22);
    r = r | p << BigInt(17);
    r = r | w << BigInt(12);
    r = r | c;

    return r.toString();
}