import {createHash} from "crypto";

export function md5(data: string): string {
    return createHash('md5').update(data).digest("hex");
}
export function createUniqHash(length: number = 16): string{
    const hash = md5(`${Date.now()}:${Math.random()}`);
    return hash.slice(0, length-1);
}