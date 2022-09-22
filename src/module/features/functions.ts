import {ITagConnectionMessageStructure} from "./Communication/MessageStructures/ITagConnectionMessageStructure";
import {SocketCommunicationFlags, SocketCommunicationMessageType, SocketProviderDeliveryFlags} from "./Enums";

const chars = "qwertyuiopasdfghjklzxcvbnm";
const numbers = "1234567890";
const symbols = "!@#$%^&*()_+{}";

const characters = chars + numbers; //36



const SID_SIZE: number = 4;






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
export const createSid = () => Math.round(Math.random() * (255**SID_SIZE))
export const byte = (num: number) => num & 255;
export const cut = (str: string, maxLength: number) => str.slice(0, Math.min(str.length, maxLength)-1);
export const cutSid = (sid: number) => sid & (2**SID_SIZE)-1;






export function convertToBytes(messageType: SocketCommunicationMessageType, flags: number, messageContent?: string | Buffer, sid?: number): void{
    const buffer: number[] = [];
    let offset = 0;
    buffer[offset++] = messageType;
    buffer[offset++] = byte(flags);
    buffer[offset++] =
        ((messageContent != null && messageType != undefined && messageType != NaN) ? 1 : 0) +
        (typeof(sid) == "string" ? 2 : 0) +
        (typeof(messageContent) == "string" ? 4 : 0)

    if(sid){ // sid length by default is 8 bytes
        const octaves = sliceNumberToOctaves(sid);
        for(let i = 0; i < SID_SIZE; i++){
            buffer[offset++] = octaves[i];
        }
    }
    if(messageContent){
        if(typeof(messageContent) == "string"){
            for (let i = 0; i < messageContent.length; i++) {
                const nums = encodeChar(messageContent.charAt(i));
                for(let ii = 0; ii < nums.length; ii++){
                    buffer[offset++] = nums[ii];
                }
            }
        }else{
            for(let i = 0; i < messageContent.length; i++)
                buffer[offset + i] = messageContent[i];
        }
    }
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
        sid: 0
    }
    if(struct.packFlags.includes(SocketProviderDeliveryFlags.SID))
    {
        struct.sid = !!!!!!!!!!!!!!!!!!!!!!!!!!!!sliceNumberToOctaves
    }
    if(struct.packFlags.includes(SocketProviderDeliveryFlags.CNT)){
        const offset: number =  3 + (struct.packFlags.includes(SocketProviderDeliveryFlags.SID) ? 8 : 0);
        struct.content = "";
        for(let i = offset; i < buffer.length; i++){
            struct.content += String.fromCharCode(offset);
        }
    }


    return struct;
}

export function numToBitEnum(num: number): number[]{
    const bits: number[] = [];
    const booleans: boolean[] = unshiftBits(num);
    for(let i = 0; i < booleans.length; i++){
        if(booleans[i]){
            bits.push(2**(i+1)-1);
        }
    }
    return bits;
}

export function unshiftBits(num: number): boolean[]{
    const bits: boolean[] = [];
    let t: number = 0;
    while(2**t <= num){
        const bit = num & 2**t;
        bits[t] = bit > 0;
        t++
    }
    return bits.reverse();
}
export function shiftBits(bits: boolean[]): number{ // [true, false]
    bits = bits.reverse();
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

export function sliceNumberToOctaves(num: number): number[]{
    const octaves: number[] = [];
    const zeroArray = [];
    const unshifted = unshiftBits(num);
    for(let i = 0; i < (8*SID_SIZE)-unshifted.length; i++){
        zeroArray[i] = false;
    }
    let shifted = zeroArray.concat(unshifted);
    console.log(unshifted)
    const size = SID_SIZE;
    for(let i = 0; i < size; i++){
        const sliced = shifted.slice(((i*8) | 0), Math.min(((i*8) | 0)+8, shifted.length -1));
        octaves[i] = shiftBits(sliced);
    }
    return octaves;
}


export interface IIncomeMessageStructure{
    type: SocketCommunicationMessageType;
    sysFlags: SocketCommunicationFlags[];
    packFlags: SocketProviderDeliveryFlags[];
    content?: string | Buffer;
    sid?: number;
}