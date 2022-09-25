import {ITagConnectionMessageStructure} from "./Communication/MessageStructures/ITagConnectionMessageStructure";
import {
    SocketDeliveryFlags,
    SocketCommunicationMessageType,
    SocketProviderDeliveryContentEncodingFlags,
    SocketProviderPacketFlags
} from "./Enums";
import * as buffer from "buffer";

const chars = "qwertyuiopasdfghjklzxcvbnm";
const numbers = "1234567890";
const symbols = "!@#$%^&*()_+{}";

const characters = chars + numbers; //36



const SID_SIZE: number = 4;
const SYNSID_SIZE: number = 2;





export function createString(length: number = 8): string{
    let sb = "";
    for(let i = 0; i < length; i++){
        sb += characters[randomAt(0, characters.length)];
    }
    return sb;
}

export function convertArrayToObject(array: any[]): any{
    const obj: any = {};
    for(let i = 0; (i+1) < array.length; i+=2){
        obj[array[i]] = array[i+1];
    }
    return obj;
}

export const concatConnectionTag = (struct: ITagConnectionMessageStructure) => `${struct.tag}-${struct.hash}`;
export const randomAt = (min: number, max: number) => Math.round((Math.random() * (max - min)) + min);
export const createSid = () => Math.round(Math.random() * (255**SID_SIZE));
export const createSYNSid = () => Math.round(Math.random() * (255**SYNSID_SIZE));
export const byte = (num: number) => num & 255;
export const cut = (str: string, maxLength: number) => str.slice(0, Math.min(str.length, maxLength)-1);
export const cutSid = (sid: number) => sid & (2**SID_SIZE)-1;






export function convertToBytes(messageType: SocketCommunicationMessageType, flags: number, cargo?: (IConvertToBytesContentOptions | string | Buffer), opts?: {sid?: number, synSid?:number}): number[]{
    let deliveryCargo: IConvertToBytesContentOptions = null;
    if(cargo){
        if(!(cargo as IConvertToBytesContentOptions).content){
            if(typeof(cargo) === "string"){
                deliveryCargo = {
                    content: cargo as string,
                    flags: [4]
                }
            }else{
                deliveryCargo = {
                    content: cargo as Buffer,
                    flags: [1]
                }
            }
        }else
            deliveryCargo = cargo as IConvertToBytesContentOptions;
    }else deliveryCargo =  {content: null, flags: []};

    opts = opts ?? {};

    const buffer: number[] = [];
    let offset = 0;
    buffer[offset++] = messageType;
    buffer[offset++] = byte(flags);
    if(flags & SocketDeliveryFlags.SYN)
    buffer[offset++] =
        ((deliveryCargo.content && messageType != NaN) ? 1 : 0) +
        (typeof(opts.sid) == "number" ? 2 : 0) +
        (typeof(deliveryCargo.content) == "string" ? 4 : 0)

    if(opts.sid){ // sid length by default is ${SID_SIZE} bytes
        const octaves = sliceNumberToOctaves(opts.sid);
        for(let i = 0; i < SID_SIZE; i++){
            buffer[offset++] = octaves[i];
        }
    }
    if(opts.synSid && flags & SocketDeliveryFlags.SYN)
    {
        const octaves = sliceNumberToOctaves(opts.synSid, SYNSID_SIZE);
        buffer[offset++] = octaves[0];
        buffer[offset++] = octaves[1];
    }
    if(deliveryCargo.content){
        buffer[offset++] = bitEnumToNum(deliveryCargo.flags)

        if(typeof(deliveryCargo.content) == "string"){
            for (let i = 0; i < deliveryCargo.content.length; i++) {
                const nums = encodeChar(deliveryCargo.content.charAt(i));
                for(let ii = 0; ii < nums.length; ii++){
                    buffer[offset++] = nums[ii];
                }
            }
        }else{
            for(let i = 0; i < deliveryCargo.content.length; i++)
                buffer[offset + i] = deliveryCargo.content[i];
        }
    }
    return buffer;
}

export function encodeChar(char: string, size: number = 2): number[]{
    /*buffer[offset + ((i * 2) | 0)] = code & 0xff
    buffer[offset + (((i * 2) | 0) + 1)] = code / 256 >>> 0;*/
    const nums: number[] = [];
    if(size === 2){
        const code = char.charCodeAt(0);
        nums[0] = code & 0xff;
        nums[1] = code / 256 >>> 0;
    }
    return nums;
}

export function convertIncomeBuffer(buffer: Buffer): IIncomeMessageStructure{
    const struct: IIncomeMessageStructure = {
        type: buffer[0] as SocketCommunicationMessageType,
        sysFlags: numToBitEnum(buffer[1]),
        packFlags: numToBitEnum(buffer[2]),
        content: null,
        sid: null,
        synSid: null
    }
    let offset: number = 3;
    if(struct.packFlags.includes(SocketProviderPacketFlags.SID))
    {
        const bytes: number[] = [];
        for(let i = 0; i < SID_SIZE; offset++, i++){
            bytes[i] = buffer[offset];
        }
        struct.sid = concatOctavesToNumber(bytes);
    }
    if(struct.sysFlags.includes(SocketDeliveryFlags.SYN)){
        const synSidArray: number[] = [];
        for(let i = 0; i < SYNSID_SIZE; i++){
            synSidArray[i] = buffer[offset++];
        }
        struct.synSid = concatOctavesToNumber(synSidArray, 2);
    }
    if(struct.packFlags.includes(SocketProviderPacketFlags.CNT)){
        struct.content = "";
        struct.contentEncoding = buffer[offset++];
        for(let i = offset; i < buffer.length; i+=2){
            const pos = buffer[i] + ((255 * buffer[i+1]) | 0);
            console.log(buffer[i])
            struct.content += String.fromCharCode(pos);
        }
    }


    return struct;
}

export function numToBitEnum(num: number): number[]{
    const unshifted: boolean[] = unshiftBits(num);
    const nums: number[] = [];
    for(let i = 0, k = 0; i < unshifted.length; i++){
        if(unshifted[i]){
            nums[k++] = 2**i;
        }
    }
    return nums;
}

export function bitEnumToNum(en: number[]): number{
    let num: number = 0;
    for(let i = 0; i < en.length; i++){
        num += en[i];
    }
    return num;
}


export function unshiftBits(num: number): boolean[]{
    const bits: boolean[] = [];
    let t: number = 0;
    while(2**t <= num){
        const bit = num & 2**t;
        bits[t] = bit > 0;
        t++
    }
    return bits;
}


export function shiftBits(bits: boolean[]): number{ // [true, false] -> 1
    bits = bits;
    let res = 0;
    for(let i = 0; i < bits.length; i++){
        if(bits[i]){
            res += 2**i;
        }
    }
    return res;
}

/*export function convertBufferToExternalNumber(buf: Buffer | number[]): number{
    const bits: boolean[] = [];
    for(let i = 0; i < buf.length; i++){
        const interBits = unshiftBits(buf[i]);
        for(let ii = 0; ii < interBits.length; ii++)
        {
            bits.push(interBits[ii]);
        }
    }
    return shiftBits(bits);
}*/

export function sliceNumberToOctaves(num: number, size: number = SID_SIZE): number[]{
    const octaves: number[] = [];
    const unshifted = unshiftBits(num);
    const zeroArray: boolean[] = [];
    for(let i = 0; i < (8*size)-unshifted.length; i++){
        zeroArray[i] = false;
    }
    let shifted = unshifted.concat(zeroArray);
    for(let i = 0; i < size; i++){
        const slicedBits: boolean[] = shifted.slice(((i*8) | 0), ((i*8) | 0) + 8);
        octaves[i] = shiftBits(slicedBits);
    }
    return octaves;
}

export function concatOctavesToNumber(nums: number[], size: number = SID_SIZE): number{
    const bits: boolean[] = [];
    for(let i = 0; i < size; i++){
        const unshifted = unshiftBits(nums[i]);
        for(let ii = 0; ii < 8; ii++){
            bits[((i*8) | 0) + ii] = ii >= unshifted.length ? false : unshifted[ii];
        }
    }
    return shiftBits(bits);
}


interface IIncomeMessageStructure{
    type: SocketCommunicationMessageType;
    sysFlags: SocketDeliveryFlags[];
    packFlags: SocketProviderPacketFlags[];
    content?: string | Buffer;
    sid?: number;
    synSid: number;
    contentEncoding?: number;
}

export interface IConvertToBytesContentOptions{
    content: string | Buffer;
    flags: SocketProviderDeliveryContentEncodingFlags[];
}